import WebMCPDataView from '@/components/WebMCPDataView';
import { useEffect, useState } from 'react';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import MainDriver from '@/drivers/MainDriver';
import FlexLayout from '@/layout/FlexLayout';
import Header from '@/layout/Header';
import StatusBar from '@/layout/StatusBar';
import MascotWrapper from '@/mascot/MascotWrapper';
import { ensureWindowDiscovery } from '@/windowDiscovery';
import { windowRegistry } from '@/windowRegistry';

function RenderWindow({ id }: { id: string }) {
  const meta = windowRegistry.get(id);
  const Comp = meta ? windowRegistry.resolve(meta) : null;
  return Comp ? <Comp /> : null;
}

export default function AppLayout() {
  const settingsStore = useSettingsStoreSelector((state) => state);

  const [, setDiscovered] = useState(false);

  useEffect(() => {
    let mounted = true;
    ensureWindowDiscovery()
      .finally(() => {
        if (mounted) setDiscovered((v) => !v);
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {windowRegistry.list().filter((m) => m.enabled !== false).map((m) => (
        <RenderWindow key={m.id} id={m.id} />
      ))}
      <MainDriver />

      <MascotWrapper />

      <WebMCPDataView
        name="check_settings_store"
        description="Get current settings store"
        execute={async () => ({
          content: [{
            type: 'text',
            text: `Current settings store is ${JSON.stringify(settingsStore)}.`
          }]
        })}
      />

      <Header />

      <FlexLayout />

      <StatusBar />
    </>
  );
}
