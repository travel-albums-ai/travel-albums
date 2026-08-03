import { ComponentType } from 'react';

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

  private componentCache = new WeakMap<
    ToolbarMeta['loader'],
    ComponentType<ToolbarComponentProps>
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

  async preload(meta: ToolbarMeta) {
    if (this.componentCache.has(meta.loader)) {
      return;
    }

    const mod = await meta.loader();
    this.componentCache.set(meta.loader, mod.default);
  }

  resolve(meta: ToolbarMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }
}

export const toolbarRegistry = new ToolbarRegistry();
