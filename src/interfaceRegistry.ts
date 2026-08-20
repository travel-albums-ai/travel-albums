import { AsyncComponentRegistry } from './discovery/registry';
import type { InterfaceMeta } from './discovery/registryTypes';

class InterfaceRegistry extends AsyncComponentRegistry<InterfaceMeta> {}

export const interfaceRegistry = new InterfaceRegistry();
