import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useFilterPhotos, useFilterStoreSelector } from '@/context/filterStore';
import { ArrowDown01Icon, ArrowUp01Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SortOrderToggle() {
  const { setSetting } = useFilterPhotos()
  const sortOrder = useFilterStoreSelector((state) => state.sortOrder)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      value: 'oldestFirst',
      tooltip: t('sortOldestFirst'),
      onClick: () => setSetting((prev) => ({...prev, sortOrder: 'oldestFirst'})),
      icon: <ArrowUp01Icon size={20} />,
      selected: sortOrder === 'oldestFirst'
    },
    {
      value: 'newestFirst',
      tooltip: t('sortNewestFirst'),
      onClick: () => setSetting((prev) => ({...prev, sortOrder: 'newestFirst'})),
      icon: <ArrowDown01Icon size={20} />,
      selected: sortOrder === 'newestFirst'
    },
  ] satisfies GenericToggleButtonProps[]} asGroup />
}
