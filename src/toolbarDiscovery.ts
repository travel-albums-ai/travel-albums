import { ToolbarMeta, toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob<ToolbarMeta | undefined>('./toggle/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<void> | null = null;

async function loadToolbarMetadata() {
  const loaded = await Promise.all(
    Object.entries(modules).map(async ([path, loadMeta]) => ({
      path,
      meta: await loadMeta(),
    })),
  );

  const metas: ToolbarMeta[] = [];

  for (const { path, meta } of loaded) {
    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    toolbarRegistry.register(meta);
    metas.push(meta);
  }

  return metas;
}

export function ensureToolbarDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = (async () => {
    const metas = await loadToolbarMetadata();
    await toolbarRegistry.preloadAll(metas);
  })();

  return discoveryPromise;
}

export function warmToolbarDiscovery() {
  void ensureToolbarDiscovery();
}
