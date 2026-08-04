import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import DrawersPopover from '@/settings/DrawersPopover';
import { Box } from '@mui/material';
import { PanelsRightBottom } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function DrawersToggle() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup
    id="settings-sections-toggle"
    variant="standard"
    items={[
      {
        tooltip: t('openPanelsSettings'),
        icon: <PanelsRightBottom />,
        popover: <Box sx={{ width: '400px', maxHeight: '50vh', overflowY: 'auto' }}>
          <DrawersPopover />
        </Box>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
