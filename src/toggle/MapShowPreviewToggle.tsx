import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryThumbnails } from 'lucide-react';

export default function MapShowPreviewToggle() {
  const { setSetting } = useSettings()
  const mapShowPreview = useSettingsStoreSelector((state) => state.mapShowPreview);

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: 'Toggle map preview',
      icon: <GalleryThumbnails />,
      onClick: () => setSetting((prev) => ({ ...prev, mapShowPreview: !prev.mapShowPreview })) ,
      selected: mapShowPreview,
    },
  ] as GenericToggleButtonProps[]} />
}

export const meta = {
  id: "mapShowPreview",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 300
    }
  ],
  component: MapShowPreviewToggle,
};
