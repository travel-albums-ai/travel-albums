import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import {
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerRowsToggle() {
  const { setSetting } = useSettings()

  const scrollerRows = useSettingsStoreSelector((state) => state.scrollerRows)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      value: '2',
      tooltip: '2 rows',
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 2})),
      icon: <Columns2 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 2,
    },
    {
      value: '3',
      tooltip: '3 rows',
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 3})),
      icon: <Columns3 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 3,
    },
    {
      value: '4',
      tooltip: '4 rows',
      onClick: () => setSetting((prev) => ({...prev, scrollerRows: 4})),
      icon: <Columns4 style={{ transform: 'rotate(90deg)' }} />,
      selected: scrollerRows === 4,
    },
  ] satisfies GenericToggleButtonProps[]} />
}

export const meta = {
  id: "scroller-rows-toggle",
  toolbar: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 700
    }
  ],
  component: ScrollerRowsToggle,
};
