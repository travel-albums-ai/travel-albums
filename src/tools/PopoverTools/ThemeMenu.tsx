import { useEffect, useState } from 'react';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingSelectRow from '@/windows/settings/components/SettingSelectRow';
import { themeNames } from '@/themes';
import { ensureThemeDiscovery } from '@/themeDiscovery';

export default function ThemeMenu() {
  const themeId = useSettingsStoreSelector((state) => state.themeId);
  const { setSetting } = useSettings();

  const [options, setOptions] = useState<string[]>(() => themeNames());

  useEffect(() => {
    let mounted = true;

    ensureThemeDiscovery().then(() => {
      if (!mounted) return;
      setOptions(themeNames());
    }).catch(() => {
      if (!mounted) return;
      setOptions(themeNames());
    });

    return () => { mounted = false };
  }, []);

  return (
    <SettingSelectRow
      label={''}
      value={themeId}
      options={options}
      onChange={(value) => {
        setSetting((prev) => ({
          ...prev,
          themeId: value,
        }));
      }}
    />
  );
}
