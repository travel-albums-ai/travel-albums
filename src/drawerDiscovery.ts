import { DrawerMeta, drawerRegistry } from '@/drawerRegistry';

const modules = import.meta.glob<DrawerMeta | undefined>('./drawers/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<void> | null = null;

async function loadDrawerMetadata() {
  const entries = Object.entries(modules);

  const settled = await Promise.allSettled(
    entries.map(([path, loadMeta]) =>
      loadMeta()
        .then((meta) => ({ path, meta }))
        .catch((error) => ({ path, meta: undefined, error }))
    ),
  );

  const metas: Array<DrawerMeta> = [];

  for (const item of settled) {
    if (item.status === 'rejected') {
      console.warn('Failed to load drawer module during discovery', item.reason);
      continue;
    }

    const { path, meta, error } = item.value as { path: string; meta?: DrawerMeta; error?: any };

    if (error) {
      console.warn(`${path} failed to load meta:`, error);
      continue;
    }

    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (typeof meta.id !== 'string' || meta.id.length === 0 || typeof meta.loader !== 'function') {
      console.warn(`${path} has invalid drawer metadata`);
      continue;
    }

    drawerRegistry.register(meta);
    metas.push(meta);
  }

  // Warm drawer component caches asynchronously.
  void Promise.allSettled(metas.map((m) => drawerRegistry.preload(m))).catch((err) => {
    console.warn('Drawer component warm preload failed', err);
  });
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
