import { DrawerMeta, drawerRegistry } from '@/drawerRegistry';

const modules = import.meta.glob<DrawerMeta | undefined>('./drawers/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<void> | null = null;

async function loadDrawerMetadata() {
  const loaded = await Promise.all(Object.entries(modules).map(async ([path, loadMeta]) => ({
    path,
    meta: await loadMeta(),
  })));

  for (const { path, meta } of loaded) {
    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (typeof meta.id !== 'string' || meta.id.length === 0 || typeof meta.loader !== 'function') {
      console.warn(`${path} has invalid drawer metadata`);
      continue;
    }

    drawerRegistry.register(meta);
  }
}

export function ensureDrawerDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadDrawerMetadata().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
