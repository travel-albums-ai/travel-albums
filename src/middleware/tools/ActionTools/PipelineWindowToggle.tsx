import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { PanelTopBottomDashed } from 'lucide-react';

export default function PipelineWindowToggle() {
  const { setSetting } = useSettings()
  const pipelineOpen = useSettingsStoreSelector((state) => state.pipelineOpen);

  const handleOnChange = () => setSetting((prev) => ({ ...prev, pipelineOpen: !prev.pipelineOpen}));

  return <>
    <WebMCPDataRun
      name="toggle_settings_modal"
      description="Toggle the settings modal visibility."
      execute={async () => {
        handleOnChange();
        return `Pipeline window ${!pipelineOpen ? 'shown' : 'hidden'}.`;
      }}
    />

    <GenericToggleButtonGroup variant="standard" id="settings-toggle" items={[
      {
        webMcp: true,
        tooltip: 'Toggle Pipeline Window',
        icon: <PanelTopBottomDashed />,
        onClick: () => handleOnChange(),
        selected: pipelineOpen,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
