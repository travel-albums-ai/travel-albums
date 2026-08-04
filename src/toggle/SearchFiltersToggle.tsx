import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import FilterPhotosPopover from '@/settings/FilterPhotosPopover';
import { ListFilter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SearchFiltersToggle() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup asGroup={true}
    id="search-filters-toggle"
    items={[
      {
        tooltip: t('openGlobalFilters'),
        icon: <ListFilter />,
        popover: <FilterPhotosPopover />,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
