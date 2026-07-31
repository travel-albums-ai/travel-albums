import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
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
