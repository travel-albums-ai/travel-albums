import { loadGlobEntries } from '@/discovery/globLoader';
import { processLoadedEntries } from '@/discovery/utils';
import { InterfaceMeta, interfaceRegistry } from '@/interfaceRegistry';

const modules = import.meta.glob<InterfaceMeta | undefined>('./middleware/interface/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<InterfaceMeta[]> | null = null;

async function loadInterfaceMetadata() {
  const items = await loadGlobEntries<InterfaceMeta | undefined>(modules);

  return await processLoadedEntries<InterfaceMeta | undefined, InterfaceMeta>(items, {
    validate: (path, meta) => {
      if (typeof meta.id !== 'string' || meta.id.length === 0) {
        console.warn(`${path} has invalid interface meta id`);
        return null;
      }

      if (typeof meta.loader !== 'function') {
        console.warn(`${path} has invalid interface meta loader`);
        return null;
      }

      return meta as InterfaceMeta;
    },
    register: (m) => interfaceRegistry.register(m),
    preload: async (ms) => Promise.allSettled(ms.map((m) => interfaceRegistry.preload(m))),
    missingMessage: "does not export 'meta'",
    failedMessage: 'Failed to load interface module during discovery',
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
