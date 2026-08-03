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

  private preloadCache = new WeakMap<
    ToolbarMeta['loader'],
    Promise<ComponentType<ToolbarComponentProps>>
  >();

  private groupCache = new Map<string, ToolbarMeta[]>();

  private groupSideCache = new Map<string, ToolbarMeta[]>();

  private sidePriority(meta: ToolbarMeta, side: 'left' | 'right') {
    return meta.toolbar?.find((g) => g.side === side)?.priority ?? 0;
  }

  register(meta: ToolbarMeta) {
    this.items.set(meta.id, meta);
    this.groupCache.clear();
    this.groupSideCache.clear();
  }

  hasItems() {
    return this.items.size > 0;
  }

  all() {
    return [...this.items.values()];
  }

  toolbar(group: string) {
    const cached = this.groupCache.get(group);

    if (cached) {
      return cached;
    }

    const items = this.all().filter((x) =>
      x.toolbar?.some((g) => g.id === group)
    );

    this.groupCache.set(group, items);
    return items;
  }

  toolbarBySide(group: string, side: 'left' | 'right') {
    const cacheKey = `${group}:${side}`;
    const cached = this.groupSideCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const items = this.toolbar(group)
      .filter((x) => x.toolbar?.some((g) => g.side === side))
      .sort((a, b) => this.sidePriority(a, side) - this.sidePriority(b, side));

    this.groupSideCache.set(cacheKey, items);
    return items;
  }

  async preload(meta: ToolbarMeta) {
    const cached = this.componentCache.get(meta.loader);

    if (cached) {
      return cached;
    }

    const inFlight = this.preloadCache.get(meta.loader);

    if (inFlight) {
      return inFlight;
    }

    const loading = meta.loader()
      .then((mod) => {
        this.componentCache.set(meta.loader, mod.default);
        return mod.default;
      })
      .finally(() => {
        this.preloadCache.delete(meta.loader);
      });

    this.preloadCache.set(meta.loader, loading);
    return loading;
  }

  preloadAll(metas: ToolbarMeta[]) {
    return Promise.all(metas.map((meta) => this.preload(meta)));
  }

  resolve(meta: ToolbarMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }
}

export const toolbarRegistry = new ToolbarRegistry();
