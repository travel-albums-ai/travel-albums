import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { Braces } from 'lucide-react';

export default function PreviewExifToggle() {
  const { setSetting } = useSettings()
  const showPreviewExif = useSettingsStoreSelector((state) => state.showPreviewExif)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: 'Toggle preview EXIF',
      onClick: () => setSetting((prev) => ({...prev, showPreviewExif: !prev.showPreviewExif})),
      icon: <Braces size={20} />,
      selected: showPreviewExif,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
