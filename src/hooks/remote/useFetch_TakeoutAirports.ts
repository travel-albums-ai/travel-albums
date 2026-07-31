import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { SERVER_ORIGIN } from '@/hooks/remote/utils';
import { benchmarkFunction } from '@/hooks/utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import localforage from 'localforage';

const TAKEOUT_AIRPORTS_URL = `${SERVER_ORIGIN}/takeout-airports`;
const TAKEOUT_AIRPORTS_URL_DEMO = `https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev/airports.json`;

const CACHE_VERSION = 1;
const LOCALFORAGE_KEY = (demo: boolean) =>
  `takeout-airports-v${CACHE_VERSION}-${demo ? 'demo' : 'live'}`;

const URLS = {
  live: TAKEOUT_AIRPORTS_URL,
  demo: TAKEOUT_AIRPORTS_URL_DEMO,
};

async function fetchAirports(demoMode: boolean, setSetting: any) {
  return benchmarkFunction(async () => {
    setSetting((prev: any) => ({ ...prev, loading: true }));

    const cached = await localforage.getItem<any>(LOCALFORAGE_KEY(demoMode));
    if (cached) {
      setSetting((prev: any) => ({ ...prev, loading: false }));
      return cached;
    }
    const response = await fetch(demoMode ? URLS.demo : URLS.live);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);

    const json = await response.json();

    localforage.setItem(LOCALFORAGE_KEY(demoMode), json).catch(console.error);

    setSetting((prev: any) => ({ ...prev, loading: false }));
    return json;
  }, '💾☁️ Airports', [])
}

export const useFetch_TakeoutAirports = () => {
  const demoMode = useSettingsStoreSelector(s => s.demoMode);
  const queryClient = useQueryClient();
  const { setSetting } = useSettings()

  const query = useQuery({
    queryKey: ['takeout-airports', demoMode],
    queryFn: () => fetchAirports(demoMode, setSetting),
    staleTime: Infinity,
    gcTime: Infinity,
    notifyOnChangeProps: ['data', 'error', 'status'],
  });

  const clearCache = async () => {
    await localforage.removeItem(LOCALFORAGE_KEY(demoMode));
    await queryClient.removeQueries({ queryKey: ['takeout-airports', demoMode] });
  };

  return {
    data: query.data,
    refetch: query.refetch,
    clearCache,
  };
};
