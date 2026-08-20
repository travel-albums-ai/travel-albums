import { loadGlobEntries } from '@/discovery/globLoader';
import { WindowMeta, windowRegistry } from '@/windowRegistry';

const modules = import.meta.glob<WindowMeta | undefined>('./middleware/windows/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<void> | null = null;

async function loadWindowMetadata() {
  const items = await loadGlobEntries<WindowMeta | undefined>(modules);

  const metas: Array<WindowMeta> = [];

  for (const item of items) {
    const { path, value: meta, error } = item as { path: string; value?: WindowMeta; error?: any };

    if (error) {
      console.warn(`${path} failed to load meta:`, error);
      continue;
    }

    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (typeof meta.id !== 'string' || meta.id.length === 0 || typeof meta.loader !== 'function') {
      console.warn(`${path} has invalid window metadata`);
      continue;
    }

    windowRegistry.register(meta);
    metas.push(meta);
  }

  // Warm window component caches asynchronously.
  void Promise.allSettled(metas.map((m) => windowRegistry.preload(m))).catch((err) => {
    console.warn('Window component warm preload failed', err);
  });
}

export function ensureWindowDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadWindowMetadata().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
