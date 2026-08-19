export interface ThemeMeta {
  id: string;
  name: string;
  loader: () => Promise<any>;
  path: string;
  module?: any;
}

class ThemeRegistry {
  private items = new Map<string, ThemeMeta>();

  register(meta: ThemeMeta) {
    const existing = this.items.get(meta.id);

    if (existing && existing.path !== meta.path) {
      console.warn(`Duplicate theme id '${meta.id}' detected. Skipping registration.`);
      return;
    }

    this.items.set(meta.id, meta);
  }

  hasItems() {
    return this.items.size > 0;
  }

  all() {
    return [...this.items.values()];
  }

  get(id: string) {
    return this.items.get(id) ?? null;
  }

  names() {
    return this.all().map((m) => m.name);
  }
}

export const themeRegistry = new ThemeRegistry();
