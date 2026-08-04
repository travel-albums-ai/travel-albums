import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SectionsPopover from '@/settings/SectionsPopover';
import { Alert } from '@mui/material';
import { Cog } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsToggle() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup asGroup={true}
    id="settings-sections-toggle"
    items={[
      {
        tooltip: t('openSectionsSettings'),
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
