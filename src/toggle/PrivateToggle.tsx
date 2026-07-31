import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { usePrivate } from '@/context/privateStore';
import { EyeClosed } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function PrivateToggle({ photoId }: { photoId: string }) {
  const { isPrivate, add, remove } = usePrivate()
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('togglePrivate'),
      icon: <EyeClosed />,
      onClick: () => isPrivate(photoId) ? remove(photoId) : add(photoId),
      selected: isPrivate(photoId),
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
