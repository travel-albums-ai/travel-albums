import type { ComponentType } from 'react';

export interface WindowMeta {
  id: string;
  loader: () => Promise<{
    default: ComponentType;
  }>;
  enabled?: boolean;
}

class WindowRegistry {
  private items = new Map<string, WindowMeta>();
  private componentCache = new WeakMap<WindowMeta['loader'], ComponentType>();

  register(meta: WindowMeta) {
    const existing = this.items.get(meta.id);

    if (existing && existing.loader !== meta.loader) {
      console.warn(`Duplicate window id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    this.items.set(meta.id, meta);
  }

  has(id: string) {
    return this.items.has(id);
  }

  async preload(meta: WindowMeta) {
    const cached = this.componentCache.get(meta.loader);

    if (cached) {
      return cached;
    }

    const component = (await meta.loader()).default;
    this.componentCache.set(meta.loader, component);
    return component;
  }

  resolve(meta: WindowMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }

  get(id: string) {
    return this.items.get(id) ?? null;
  }

  list() {
    return Array.from(this.items.values());
  }
}

export const windowRegistry = new WindowRegistry();
