import { useMutation } from '@tanstack/react-query';

const SERVER_ORIGIN =
  import.meta.env.VITE_TAKEOUT_SERVER_ORIGIN?.trim() || 'http://localhost:3001'

const SCRIPTS_RUN_URL = `${SERVER_ORIGIN}/scripts/run`;

type RunOpts = {
  mode?: 'sync' | 'async';
  env?: Record<string, string>;
  timeoutMs?: number;
};

export const usePost_ScriptsGenerateThumbnails = () => {
  const mutation = useMutation({
    mutationFn: async (opts: RunOpts = {} as RunOpts) => {
      const body = {
        script: 'indexer.mjs',
        mode: opts.mode ?? 'sync',
        env: opts.env ?? {},
        timeoutMs: opts.timeoutMs ?? 0,
      };

      const res = await fetch(SCRIPTS_RUN_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || `Request failed: ${res.status}`);
      }

      return res.json();
    },
  });

  return {
    run: (opts?: RunOpts) => mutation.mutateAsync((opts ?? {}) as RunOpts),
    isLoading: mutation.status === 'pending',
    status: mutation.status,
    data: mutation.data ?? null,
    error: mutation.error ?? null,
  };
};
