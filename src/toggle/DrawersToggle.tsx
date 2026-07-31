import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import DrawersPopover from '@/settings/DrawersPopover';
import { Box } from '@mui/material';
import { PanelsRightBottom } from 'lucide-react';

export default function DrawersToggle() {

  return <GenericToggleButtonGroup
    id="settings-sections-toggle"
    variant="standard"
    items={[
      {
        tooltip: 'Open panels settings',
        icon: <PanelsRightBottom />,
        popover: <Box sx={{ width: '400px', maxHeight: '50vh', overflowY: 'auto' }}>
          <DrawersPopover />
        </Box>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
