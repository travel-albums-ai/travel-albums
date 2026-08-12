import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SectionsPopover from '@/settings/SectionsPopover';
import { Box } from '@mui/material';
import { Cog } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsToggle() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup
    id="settings-sections-toggle"
    items={[
      {
        tooltip: t('openSectionsSettings'),
        icon: <Cog />,
        popover: <Box sx={{ width: '400px', maxHeight: '75vh', overflowY: 'auto' }}>
          <SectionsPopover />
        </Box>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
