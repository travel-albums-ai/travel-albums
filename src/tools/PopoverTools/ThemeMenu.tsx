import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingSelectRow from '@/windows/settings/components/SettingSelectRow';

export default function ThemeMenu() {
  const themeId = useSettingsStoreSelector((state) => state.themeId)
  const { setSetting } = useSettings()

  return <SettingSelectRow
    label={''}
    value={themeId}
    options={['default', 'barbie', 'solarized', 'monokai', 'dracula']}
    onChange={(value) => {
      setSetting((prev) => ({
        ...prev,
        themeId: value,
      }))
    }}
  />
}
