import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import SectionsPopover from '@/settings/SectionsPopover';
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
        popover: <SectionsPopover />,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
