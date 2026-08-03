import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CheckCheck, Square } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SelectModeToggle() {
  const { setSetting } = useSettings()
  const selectMode = useSettingsStoreSelector((state) => state.selectMode)
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      id: "selectMode",
      group: ['general'],
      tooltip: t('toggleSelectMode'),
      kbd: 'Shift+S',
      meta: {
        name: t('toggleSelectModeName'),
        description: t('toggleSelectModeDescription'),
        icon: <CheckCheck />,
        group: 'Select Mode'
      },
      icon: selectMode ? <CheckCheck /> : <Square />,
      onClick: () => setSetting((prev) => ({ ...prev, selectMode: !prev.selectMode })),
      selected: selectMode,
    },
  ] satisfies GenericToggleButtonProps[]} />
}

export const meta = {
  id: "selectMode",
  toolbar: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 100
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 200
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 300
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 400
    },
  ],
  component: SelectModeToggle,
};
