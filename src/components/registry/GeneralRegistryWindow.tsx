import { ensureWindowDiscovery } from '@/windowDiscovery';
import { windowRegistry } from '@/windowRegistry';
import { useEffect, useState } from 'react';

function RenderWindow({ id }: { id: string }) {
  const meta = windowRegistry.get(id);
  const Comp = meta ? windowRegistry.resolve(meta) : null;
  return Comp ? <Comp /> : null;
}

export default function GeneralRegistryWindow() {
  const [, setDiscovered] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        await ensureWindowDiscovery();

        const enabled = windowRegistry.list().filter((m) => m.enabled !== false);

        // Preload all enabled window components to populate the cache
        await Promise.allSettled(enabled.map((m) => windowRegistry.preload(m)));
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setDiscovered((v) => !v);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {windowRegistry.list().filter((m) => m.enabled !== false).map((m) => (
        <RenderWindow key={m.id} id={m.id} />
      ))}
    </>
  );
}
