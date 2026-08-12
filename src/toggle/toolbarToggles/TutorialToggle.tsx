import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CircleQuestionMark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TutorialToggle() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);
  const { t } = useTranslation()

  return <>
    <GenericToggleButtonGroup variant="standard" items={[
      {
        tooltip: t('tutorialToggleTooltip'),
        icon: <CircleQuestionMark size={16} />,
        onClick: () => setSetting((prev) => ({ ...prev, tutorial: !tutorial })),
        selected: tutorial,
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>;
}
