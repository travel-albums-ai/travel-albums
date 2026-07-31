import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { MapPin, MapPinX } from 'lucide-react';

export default function MapAllToggle() {
  const { setSetting } = useSettings()
  const showMapAll = useSettingsStoreSelector((state) => state.showMapAll)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: 'Toggle all the photos / selected photos on the map',
      onClick: () => setSetting((prev) => ({...prev, showMapAll: !prev.showMapAll})),
      icon: showMapAll ? <MapPin size={20} /> : <MapPinX size={20} />,
      selected: showMapAll,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
