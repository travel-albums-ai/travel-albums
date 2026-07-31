import { useSelected, useSelected_isSelected } from '@/context/selectedStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { Square, SquareCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectedToggle({ photoId }: { photoId: string }) {
  const { add, remove } = useSelected()
  const isSelected = useSelected_isSelected(photoId)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: t('toggleSelected'),
      icon:  isSelected ? <SquareCheck /> : <Square />,
      onClick: () => isSelected ? remove(photoId) : add(photoId),
      selected: isSelected,
    },
  ] as GenericToggleButtonProps[]} />
}
