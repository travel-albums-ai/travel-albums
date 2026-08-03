// toolbarDiscovery.ts

import { toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob('./toggle/*.meta.ts', {
  eager: true,
});

for (const [path, mod] of Object.entries(modules)) {
  const meta = (mod as any).meta;

  if (!meta) {
    console.warn(`${path} does not export 'meta'`);
    continue;
  }

  toolbarRegistry.register(meta);
}
