// toolbarDiscovery.ts

import { ToolbarMeta, toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob<{ meta?: ToolbarMeta }>('./toggle/*.meta.ts', {
  eager: true,
});

for (const [path, mod] of Object.entries(modules)) {
  const meta = mod.meta;

  if (!meta) {
    console.warn(`${path} does not export 'meta'`);
    continue;
  }

  toolbarRegistry.register(meta);
}
