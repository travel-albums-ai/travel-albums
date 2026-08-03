import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
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

export const meta = {
  id: "mapAll",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 400
    }
  ],
  component: MapAllToggle,
};
