import FilterPhotosPopover from '@/settings/FilterPhotosPopover';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
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
