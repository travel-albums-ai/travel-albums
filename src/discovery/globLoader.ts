import { benchmarkFunctionAsync } from '@/hooks/utils';

export type LoadEntry<T> = {
  path: string;
  value?: T;
  error?: any;
};

export async function loadGlobEntries<T>(
  modules: Record<string, () => Promise<T | undefined>>,
  timeoutMs = 5000,
): Promise<LoadEntry<T>[]> {
  const entries = Object.entries(modules);

  function withTimeout<P>(p: Promise<P>, ms: number) {
    if (!ms || ms <= 0) return p;

    let id: number | undefined;

    return new Promise<P>((resolve, reject) => {
      id = setTimeout(() => reject(new Error('loader timeout')), ms);

      p.then(
        (v) => {
          if (id !== undefined) clearTimeout(id);
          resolve(v);
        },
        (e) => {
          if (id !== undefined) clearTimeout(id);
          reject(e);
        },
      );
    });
  }

  const settled = await benchmarkFunctionAsync<PromiseSettledResult<{ path: string; value?: T; error?: any }>[]>(
    () =>
      Promise.allSettled(
        entries.map(([path, loader]) =>
          withTimeout(loader(), timeoutMs)
            .then((value) => ({ path, value }))
            .catch((error) => ({
              path,
              value: undefined as unknown as T,
              error,
            })),
        ),
      ),
    '👀 loadGlobEntries',
    [`${entries.length} modules`, `${entries.map(([path]) => path.split('/').pop()?.replaceAll('.meta.ts', '')).join(', ')} loaded`],
  );

  return settled.map((item, i) => {
    if (item.status === 'rejected') {
      return {
        path: entries[i][0],
        error: item.reason,
      };
    }

    return item.value as LoadEntry<T>;
  });
}
