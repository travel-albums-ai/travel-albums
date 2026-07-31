import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import DrawersPopover from '@/settings/DrawersPopover';
import { Cog } from 'lucide-react';

export default function DrawersToggle() {

  return <GenericToggleButtonGroup
    id="settings-sections-toggle"
    items={[
      {
        tooltip: 'Open sections settings',
        icon: <Cog />,
        popover: <>
          <DrawersPopover />
        </>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
