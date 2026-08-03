import { ToolbarMeta, toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob<{ meta?: ToolbarMeta }>('./toggle/*.meta.ts');

let discoveryPromise: Promise<void> | null = null;

export function ensureToolbarDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = (async () => {
    const loaded = await Promise.all(
      Object.entries(modules).map(async ([path, loadModule]) => {
        const mod = await loadModule();
        return { path, meta: mod.meta };
      }),
    );

    for (const { path, meta } of loaded) {
      if (!meta) {
        console.warn(`${path} does not export 'meta'`);
        continue;
      }

      toolbarRegistry.register(meta);
      await toolbarRegistry.preload(meta);
    }
  })();

  return discoveryPromise;
}
