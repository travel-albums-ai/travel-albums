import SectionsPopover from '@/settings/SectionsPopover';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import { Alert } from '@mui/material';
import { Cog } from 'lucide-react';

export default function SettingsToggle() {

  return <GenericToggleButtonGroup asGroup={true}
    id="settings-sections-toggle"
    items={[
      {
        tooltip: 'Open sections settings',
        icon: <Cog />,
        popover: <>
          <Alert severity="info" sx={{ fontSize: '0.75rem' }} variant="outlined">
          You can manage your sections here. Sections with no data will not be displayed in the sidebar.
          </Alert>
          <SectionsPopover />
        </>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
