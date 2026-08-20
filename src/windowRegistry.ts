import { AsyncComponentRegistry } from './discovery/registry';
import type { WindowMeta } from './discovery/registryTypes';

class WindowRegistry extends AsyncComponentRegistry<WindowMeta> {
  list() {
    return this.all();
  }
}

export const windowRegistry = new WindowRegistry();
