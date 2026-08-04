import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useRegisterTool from '@/hooks/useRegisterTool';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function SettingsModalToggle() {
  const { setSetting } = useSettings()
  const showSettings = useSettingsStoreSelector((state) => state.showSettings);
  const { t } = useTranslation()

  useRegisterTool(
    {
      name: "get_settings_modal_state",
      description: "Returns whether the settings modal is currently visible.",

      execute: async () => ({
        structuredContent: {
          visible: showSettings,
        },
        content: [{
          type: "text",
          text: showSettings
            ? "Settings modal is visible."
            : "Settings modal is hidden."
        }]
      })
    },
    [showSettings, setSetting]
  );

  useRegisterTool(
    {
      name: 'toggle_settings_modal',
      description:
        'Toggle the settings modal visibility.',
      inputSchema: {
        type: 'object',
        properties: {
          show: {
            type: 'boolean',
            description: 'Whether to show or hide the settings modal. If omitted, toggles the current state.',
          },
        },
      },
      execute: async ({ show }: { show?: boolean }) => {
        setSetting((prev) => ({
          ...prev,
          showSettings: typeof show === 'boolean' ? show : !prev.showSettings,
        }));

        return {
          structuredContent: {
            visible: typeof show === 'boolean' ? show : !showSettings,
          },
          content: [
            {
              type: 'text',
              text: `Settings modal ${typeof show === 'boolean' ? (show ? 'shown' : 'hidden') : (!showSettings ? 'shown' : 'hidden')}.`,
            },
          ],
        };
      },
    },
    [showSettings, setSetting]
  );

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: 'Toggle Settings Modal',
      icon: <Settings />,
      onClick: () => setSetting((prev) => ({ ...prev, showSettings: !showSettings })) ,
      selected: showSettings,
    },
  ] as GenericToggleButtonProps[]} />
}
