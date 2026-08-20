import { loadGlobEntries } from '@/discovery/globLoader';
import { InterfaceMeta, interfaceRegistry } from '@/interfaceRegistry';

const modules = import.meta.glob<InterfaceMeta | undefined>('./middleware/interface/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<void> | null = null;

async function loadInterfaceMetadata() {
  const items = await loadGlobEntries<InterfaceMeta | undefined>(modules);

  const metas: Array<InterfaceMeta> = [];

  for (const item of items) {
    const { path, value: meta, error } = item as { path: string; value?: InterfaceMeta; error?: any };

    if (error) {
      console.warn(`${path} failed to load meta:`, error);
      continue;
    }

    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (typeof meta.id !== 'string' || meta.id.length === 0 || typeof meta.loader !== 'function') {
      console.warn(`${path} has invalid interface metadata`);
      continue;
    }

    interfaceRegistry.register(meta);
    metas.push(meta);
  }

  // Warm interface component caches asynchronously.
  void Promise.allSettled(metas.map((m) => interfaceRegistry.preload(m))).catch((err) => {
    console.warn('Interface component warm preload failed', err);
  });
}

export function ensureInterfaceDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadInterfaceMetadata().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
