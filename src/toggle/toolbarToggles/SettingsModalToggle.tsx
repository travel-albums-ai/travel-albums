import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataRun from '@/components/WebMCPDataRun';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Settings } from 'lucide-react';

export default function SettingsModalToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);

  const handleOnChange = (show?: boolean) => setSetting((prev) => ({ ...prev, showSettings: show ?? !prev.showSettings}));

  return <>
    <WebMCPDataRun
      name="toggle_settings_modal"
      description="Toggle the settings modal visibility."
      inputSchema={{
        type: 'object',
        properties: {
          show: {
            type: 'boolean',
            description: 'Whether to show or hide the settings modal. If omitted, toggles the current state.',
          },
        },
        additionalProperties: false,
      }}
      execute={async ({ show }: { show?: boolean }) => {
        handleOnChange(show);

        return `Settings modal ${typeof show === 'boolean' ? (show ? 'shown' : 'hidden') : (!showSettings ? 'shown' : 'hidden')}.`;
      }}
    />

    <GenericToggleButtonGroup variant="standard" items={[
      {
        webMcp: true,
        tooltip: 'Toggle Settings Modal',
        icon: <Settings />,
        onClick: () => handleOnChange(),
        selected: showSettings,
      },
    ] as GenericToggleButtonProps[]} />
  </>
}
