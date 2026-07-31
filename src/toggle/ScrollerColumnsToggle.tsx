import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { GenericToggleButtonProps } from '@/toggle/shared/GenericToggleButton';
import GenericToggleButtonGroup from '@/toggle/shared/GenericToggleButtonGroup';
import {
  Columns2,
  Columns3,
  Columns4
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ScrollerColumnsToggle() {
  const { setSetting } = useSettings()

  const scrollerColumns = useSettingsStoreSelector((state) => state.scrollerColumns)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      value: '2',
      tooltip: '2 columns',
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 2})),
      icon: <Columns2 />,
      selected: scrollerColumns === 2,
    },
    {
      value: '3',
      tooltip: '3 columns',
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 3})),
      icon: <Columns3 />,
      selected: scrollerColumns === 3,
    },
    {
      value: '4',
      tooltip: '4 columns',
      onClick: () => setSetting((prev) => ({...prev, scrollerColumns: 4})),
      icon: <Columns4 />,
      selected: scrollerColumns === 4,
    },
  ] satisfies GenericToggleButtonProps[]} />
}
