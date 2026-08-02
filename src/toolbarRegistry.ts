class Registry {
  private readonly commands = new Map<string, Meta>();

  register(meta: Meta) {
    this.commands.set(meta.id, meta);
  }

  get(id: string) {
    return this.commands.get(id);
  }

  all() {
    return [...this.commands.values()];
  }

  toolbar(group: string) {
    return this.all()
      .filter(x => x.toolbar?.some(g => g.id === group))
      // .filter(x => x.group?.some(g => g === group))
      // .sort((a, b) => (a.toolbar?.priority ?? 0) - (b.toolbar?.priority ?? 0));
  }

  find(predicate: (m: Meta) => boolean) {
    return this.all().filter(predicate);
  }
}

export const toolbarRegistry = new Registry();
