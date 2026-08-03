import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MessagesSquare } from 'lucide-react';

export default function PreviewCommentsToggle() {
  const { setSetting } = useSettings()
  const showPreviewComments = useSettingsStoreSelector((state) => state.showPreviewComments)
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <GenericToggleButtonGroup items={[
    {
      tooltip: 'Toggle preview comments',
      onClick: () => setSetting((prev) => ({...prev, showPreviewComments: !prev.showPreviewComments})),
      icon: <MessagesSquare size={20} />,
      selected: showPreviewComments,
      disabled: previewPhotoObj?.social?.length === 0,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}

export const meta = {
  id: "previewCommentsToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 200
    }
  ],
  component: PreviewCommentsToggle,
};
