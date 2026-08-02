// toolbarDiscovery.ts

import { toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob('./toggle/*.tsx', {
  eager: true,
});

for (const mod of Object.values(modules)) {
  if ('meta' in mod) {
    toolbarRegistry.register(mod.meta);
  }
}
