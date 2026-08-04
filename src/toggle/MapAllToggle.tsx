import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MapPin, MapPinX } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function MapAllToggle() {
  const { setSetting } = useSettings()
  const showMapAll = useSettingsStoreSelector((state) => state.showMapAll)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleMapAll'),
      onClick: () => setSetting((prev) => ({...prev, showMapAll: !prev.showMapAll})),
      icon: showMapAll ? <MapPin size={20} /> : <MapPinX size={20} />,
      selected: showMapAll,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
