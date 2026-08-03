import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface ToolbarMeta {
  id: string;

  toolbar?: {
    id: string;
    side: 'left' | 'right';
    priority?: number;
    visible?: (context: unknown) => boolean;
  }[];

  loader: () => Promise<{
    default: ComponentType<any>;
  }>;
}

class ToolbarRegistry {
  private items = new Map<string, any>();

  private lazyCache = new WeakMap<
  ToolbarMeta['loader'],
  LazyExoticComponent<ComponentType<any>>
>();

  register(meta: any) {
    this.items.set(meta.id, meta);
  }

  all() {
    return [...this.items.values()];
  }

  toolbar(group: string) {
    return this.all().filter(x =>
      x.toolbar?.some(g => g.id === group)
    );
  }

  resolve(meta: ToolbarMeta) {
    let component = this.lazyCache.get(meta.loader);

    if (!component) {
      component = lazy(meta.loader);
      this.lazyCache.set(meta.loader, component);
    }

    return component;
  }
}

export const toolbarRegistry = new ToolbarRegistry();
