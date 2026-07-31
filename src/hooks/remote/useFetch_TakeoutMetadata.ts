import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';
import { processMetadata } from '@/lib/useProcessedImages.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

const CACHE_VERSION = 1;
const LOCALFORAGE_KEY = (demo: boolean) =>
  `takeout-metadata-v${CACHE_VERSION}-${demo ? 'demo' : 'live'}`;

const URLS = {
  live: `${SERVER_ORIGIN}/takeout-metadata`,
  demo: 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev/metadata.json',
};

/**
 * Streams the response body and parses NDJSON lines as chunks arrive,
 * instead of buffering the whole payload via response.text() first.
 * Saves peak memory and lets JSON.parse work overlap with network I/O.
 */
async function parseNDJSONStream(body: ReadableStream<Uint8Array>): Promise<Record<string, unknown>> {
  const raw: Record<string, unknown> = Object.create(null);
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  const consumeLine = (line: string) => {
    if (line.length === 0) return;
    const obj = JSON.parse(line) as Record<string, unknown>;
    // Avoids Object.keys(obj)[0], which allocates a throwaway array per line.
    for (const key in obj) {
      raw[key] = obj[key];
      break;
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (value) {
      buffer += decoder.decode(value, { stream: true });

      let start = 0;
      let idx: number;
      while ((idx = buffer.indexOf('\n', start)) !== -1) {
        consumeLine(buffer.slice(start, idx));
        start = idx + 1;
      }
      // Keep only the trailing partial line for the next chunk.
      buffer = start > 0 ? buffer.slice(start) : buffer;
    }

    if (done) {
      buffer += decoder.decode(); // flush any remaining decoder state
      if (buffer.length) consumeLine(buffer);
      break;
    }
  }

  return raw;
}

/**
 * Dedupes on (title, takenAtTs) using a nested Map<title, Set<ts>>
 * instead of a Set<string> keyed by a concatenated template string.
 * Avoids allocating + hashing one long composite string per photo.
 */
function dedupePhotos(processed: GalleryPhoto[]): GalleryPhoto[] {
  const seen = new Map<string, Set<number | string>>();
  const result: GalleryPhoto[] = new Array(processed.length);
  let count = 0;

  for (let i = 0; i < processed.length; i++) {
    const photo = processed[i];
    const title = photo.title ?? '';
    const ts = photo.takenAtTs ?? '';

    let tsSet = seen.get(title);
    if (tsSet === undefined) {
      tsSet = new Set();
      seen.set(title, tsSet);
    } else if (tsSet.has(ts)) {
      continue;
    }

    tsSet.add(ts);
    result[count++] = photo;
  }

  result.length = count; // trim the preallocated array to actual size
  return result;
}

async function fetchAndProcess(demoMode: boolean, setSetting: any): Promise<GalleryPhoto[]> {
  return benchmarkFunction(async () => {
    setSetting((prev: any) => ({ ...prev, loading: true }));

    const cached = await localforage.getItem<GalleryPhoto[]>(LOCALFORAGE_KEY(demoMode));
    if (cached) {
      setSetting((prev: any) => ({ ...prev, loading: false }));
      return cached;
    }

    const response = await fetch(demoMode ? URLS.demo : URLS.live);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    if (!response.body) throw new Error('Response has no body stream');

    const raw = await parseNDJSONStream(response.body);
    const processed = processMetadata(raw);
    const uniquePhotos = dedupePhotos(processed ?? []);

    localforage.setItem(LOCALFORAGE_KEY(demoMode), uniquePhotos).catch(console.error);

    setSetting((prev: any) => ({ ...prev, loading: false }));
    return uniquePhotos;
  }, '💾☁️ Metadata', [])
}

export function useFetch_TakeoutMetadata() {
  const queryClient = useQueryClient();
  const demoMode = useSettingsStoreSelector(s => s.demoMode);
  const { setSetting } = useSettings();

  const query = useQuery({
    queryKey: ['takeout-metadata', demoMode],
    queryFn: () => fetchAndProcess(demoMode, setSetting),
    staleTime: Infinity,
    gcTime: Infinity,
    notifyOnChangeProps: ['data', 'error', 'status'],
  });

  const clearCache = async () => {
    await localforage.removeItem(LOCALFORAGE_KEY(demoMode));
    await queryClient.invalidateQueries({ queryKey: ['takeout-metadata', demoMode] });
  };

  return {
    data: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
    clearCache,
  };
}
