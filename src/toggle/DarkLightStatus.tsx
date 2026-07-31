import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { MoonStar, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DarkLightStatus() {
  const { setSetting } = useSettings()
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const { t } = useTranslation()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: t('toggleThemeTooltip'),
      kbd: 'Alt+`',
      meta: {
        name: t('toggleThemeName'),
        description: t('toggleThemeDescription'),
        icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
        group: 'Appearance'
      },
      icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
      onClick: () => setSetting((prev) => ({ ...prev, themeMode: themeMode === 'light' ? 'dark' : 'light'})),
      selected: themeMode !== 'dark',
    },
  ] satisfies GenericToggleButtonProps[]} />
}
