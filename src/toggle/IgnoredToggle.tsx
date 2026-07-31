import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useIgnored, useIgnored_isIgnored } from '@/context/ignoredStore';
import { Trash } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function IgnoredToggle({ photoId }: { photoId: string }) {
  const { add, remove } = useIgnored()
  const isIgnored = useIgnored_isIgnored(photoId)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      tooltip: t('toggleIgnored'),
      icon: <Trash />,
      onClick: () => isIgnored ? remove(photoId) : add(photoId),
      selected: isIgnored,
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}
