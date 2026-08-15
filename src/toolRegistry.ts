import { ComponentType } from 'react';

export interface ToolComponentProps {
  context?: unknown;
}

export interface ToolMeta {
  id: string;

  enabled?: boolean;

  tool?: {
    id: string;
    side: 'left' | 'right';
    priority?: number;
    visible?: (_context: unknown) => boolean;
  }[];

  loader: () => Promise<{
    default: ComponentType<ToolComponentProps>;
  }>;
}

class ToolRegistry {
  private items = new Map<string, ToolMeta>();

  private componentCache = new WeakMap<
    ToolMeta['loader'],
    ComponentType<ToolComponentProps>
  >();

  private preloadCache = new WeakMap<
    ToolMeta['loader'],
    Promise<ComponentType<ToolComponentProps>>
  >();

  private groupCache = new Map<string, ToolMeta[]>();

  private groupSideCache = new Map<string, ToolMeta[]>();

  private sidePriority(meta: ToolMeta, side: 'left' | 'right') {
    return meta.tool?.find((g) => g.side === side)?.priority ?? 0;
  }

  register(meta: ToolMeta) {
    const existing = this.items.get(meta.id);

    if (existing && existing.loader !== meta.loader) {
      console.warn(`Duplicate tool meta id '${meta.id}' detected. Skipping registration.`);
      return;
    }

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

  tool(group: string) {
    const cached = this.groupCache.get(group);

    if (cached) {
      return cached;
    }

    const items = this.all().filter((x) =>
      x.tool?.some((g) => g.id === group)
    );

    this.groupCache.set(group, items);
    return items;
  }

  toolBySide(group: string, side: 'left' | 'right') {
    const cacheKey = `${group}:${side}`;
    const cached = this.groupSideCache.get(cacheKey);

    if (cached) {
      return cached;
    }

    const items = this.tool(group)
      .filter((x) => x.tool?.some((g) => g.side === side && g.id === group))
      .sort((a, b) => this.sidePriority(a, side) - this.sidePriority(b, side));

    this.groupSideCache.set(cacheKey, items);
    return items;
  }

  async preload(meta: ToolMeta) {
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

  preloadAll(metas: ToolMeta[]) {
    return Promise.all(metas.map((meta) => this.preload(meta)));
  }

  resolve(meta: ToolMeta) {
    return this.componentCache.get(meta.loader) ?? null;
  }
}

export const toolRegistry = new ToolRegistry();
