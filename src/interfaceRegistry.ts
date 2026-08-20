import type { LucideIcon } from 'lucide-react';
import { ComponentType } from 'react';

export interface InterfaceMeta {
  id: string;
  icon: LucideIcon;
  loader: () => Promise<{
    default: ComponentType;
  }>;
}

class InterfaceRegistry {
  private items = new Map<string, InterfaceMeta>();
  private componentCache = new WeakMap<InterfaceMeta['loader'], ComponentType>();

  register(meta: InterfaceMeta) {
    const existing = this.items.get(meta.id);

    if (existing && existing.loader !== meta.loader) {
      console.warn(`Duplicate interface id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    this.items.set(meta.id, meta);
  }

  has(id: string) {
    return this.items.has(id);
  }

  async preload(meta: InterfaceMeta) {
    const cached = this.componentCache.get(meta.loader);

    if (cached) {
      return cached;
    }

    const component = (await meta.loader()).default;
    this.componentCache.set(meta.loader, component);
    return component;
  }

  resolve(meta: InterfaceMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }

  get(id: string) {
    return this.items.get(id) ?? null;
  }
}

export const interfaceRegistry = new InterfaceRegistry();
