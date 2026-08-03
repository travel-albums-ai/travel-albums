import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import FilterPhotosPopover from '@/settings/FilterPhotosPopover';
import { ListFilter } from 'lucide-react';

export default function SearchFiltersToggle() {

  return <GenericToggleButtonGroup asGroup={true}
    id="search-filters-toggle"
    items={[
      {
        tooltip: 'Open global filters',
        icon: <ListFilter />,
        popover: <FilterPhotosPopover />,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
