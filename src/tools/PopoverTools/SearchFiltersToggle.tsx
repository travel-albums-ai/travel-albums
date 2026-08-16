import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import FilterPhotosPopover from '@/windows/settings/FilterPhotosPopover';
import { Box } from '@mui/material';
import { ListFilter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SearchFiltersToggle() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup
    id="search-filters-toggle"
    items={[
      {
        tooltip: t('openGlobalFilters'),
        icon: <ListFilter />,
        popover: <Box sx={{ width: '500px', maxHeight: '75vh', overflowY: 'auto' }}>
          <FilterPhotosPopover />
        </Box>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
