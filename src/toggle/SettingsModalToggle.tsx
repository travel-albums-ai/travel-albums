import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsModalToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);
  const { t } = useTranslation()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: t('toggleOnboarding'),
      icon: <Settings />,
      onClick: () => setSetting((prev) => ({ ...prev, showSettings: !showSettings })) ,
      selected: showSettings,
    },
  ] as GenericToggleButtonProps[]} />
}
