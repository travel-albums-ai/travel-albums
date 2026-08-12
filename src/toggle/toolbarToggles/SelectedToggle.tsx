import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSelected, useSelected_isSelected } from '@/context/selectedStore';
import { Square, SquareCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectedToggle({ context } : { context: { photoId: string }}) {
  const { add, remove } = useSelected()
  const photoId = context.photoId
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
