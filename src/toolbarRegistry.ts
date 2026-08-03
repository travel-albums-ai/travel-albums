import { ComponentType, lazy, LazyExoticComponent } from 'react';

export interface ToolbarComponentProps {
  context?: unknown;
}

export interface ToolbarMeta {
  id: string;

  toolbar?: {
    id: string;
    side: 'left' | 'right';
    priority?: number;
    visible?: (_context: unknown) => boolean;
  }[];

  loader: () => Promise<{
    default: ComponentType<ToolbarComponentProps>;
  }>;
}

class ToolbarRegistry {
  private items = new Map<string, ToolbarMeta>();

  private lazyCache = new WeakMap<
  ToolbarMeta['loader'],
  LazyExoticComponent<ComponentType<ToolbarComponentProps>>
>();

  register(meta: ToolbarMeta) {
    this.items.set(meta.id, meta);
  }

  hasItems() {
    return this.items.size > 0;
  }

  all() {
    return [...this.items.values()];
  }

  toolbar(group: string) {
    return this.all().filter(x =>
      x.toolbar?.some((g) => g.id === group)
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
