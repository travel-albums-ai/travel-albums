import type { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

export interface DrawerMeta {
  id: string;
  icon: LucideIcon;
  loader: () => Promise<{
    default: ComponentType;
  }>;
}

class DrawerRegistry {
  private items = new Map<string, DrawerMeta>();
  private componentCache = new WeakMap<DrawerMeta['loader'], ComponentType>();

  register(meta: DrawerMeta) {
    const existing = this.items.get(meta.id);

    if (existing && existing.loader !== meta.loader) {
      console.warn(`Duplicate drawer id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    this.items.set(meta.id, meta);
  }

  has(id: string) {
    return this.items.has(id);
  }

  async preload(meta: DrawerMeta) {
    const cached = this.componentCache.get(meta.loader);

    if (cached) {
      return cached;
    }

    const component = (await meta.loader()).default;
    this.componentCache.set(meta.loader, component);
    return component;
  }

  resolve(meta: DrawerMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }

  get(id: string) {
    return this.items.get(id) ?? null;
  }
}

export const drawerRegistry = new DrawerRegistry();
