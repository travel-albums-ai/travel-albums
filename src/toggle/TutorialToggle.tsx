import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { CircleQuestionMark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function TutorialToggle() {
  const { setSetting } = useSettings()
  const tutorial = useSettingsStoreSelector((state) => state.tutorial);
  const { t } = useTranslation()

  return <>
    <WebMCPDataView
      name="check_tutorial_state"
      description="Get current tutorial state"
      execute={async () => ({
        content: [{
          type: 'text',
          text: `Tutorial is currently ${tutorial ? 'enabled' : 'disabled'}.`
        }]
      })}
    />

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
