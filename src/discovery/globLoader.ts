export type LoadEntry<T> = {
  path: string;
  value?: T;
  error?: any;
};

export async function loadGlobEntries<T>(
  modules: Record<string, () => Promise<T | undefined>>,
): Promise<LoadEntry<T>[]> {
  const entries = Object.entries(modules);

  const settled = await Promise.allSettled(
    entries.map(([path, loader]) =>
      loader()
        .then((value) => ({ path, value }))
        .catch((error) => ({ path, value: undefined as unknown as T, error })),
    ),
  );

  return settled.map((item, i) => {
    if (item.status === 'rejected') {
      return { path: entries[i][0], error: item.reason };
    }

    return item.value as LoadEntry<T>;
  });
}

export default loadGlobEntries;
