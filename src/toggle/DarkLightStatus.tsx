import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { MoonStar, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWebMCP } from 'usewebmcp';

export default function DarkLightStatus() {
  const { setSetting } = useSettings()
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const { t } = useTranslation()

  useWebMCP({
    name: 'toggle_theme',
    description: 'Switch the application between light and dark theme, or toggle the current theme.',
    inputSchema: {
      type: 'object',
      properties: {
        mode: {
          type: 'string',
          enum: ['light', 'dark', 'toggle'],
          description: 'Theme to switch to. Defaults to toggle.',
        },
      },
      additionalProperties: false,
    } as const,
    execute: async ({ mode = 'toggle' }) => {
      let nextTheme: 'light' | 'dark' = 'light';

      setSetting((prev) => {
        nextTheme =
        mode === 'toggle'
          ? prev.themeMode === 'light'
            ? 'dark'
            : 'light'
          : mode;

        return {
          ...prev,
          themeMode: nextTheme,
        };
      });

      return { themeMode: nextTheme };
    },
    onError: (error) => {
      console.error('Error toggling theme:', error);
    },
  });

  return <>
    <WebMCPDataView
      name="check_theme_mode_mcp"
      description="Get current theme mode"
      execute={async () => ({
        content: [{
          type: 'text',
          text: `Current theme mode is ${themeMode}.`
        }]
      })}
    />

    <GenericToggleButtonGroup variant="standard" items={[
      {
        tooltip: t('toggleThemeTooltip'),
        kbd: 'Alt+`',
        meta: {
          name: t('toggleThemeName'),
          description: t('toggleThemeDescription'),
          icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
          group: 'Appearance'
        },
        icon: themeMode === 'light' ? <MoonStar /> : <Sun />,
        onClick: () => setSetting((prev) => ({ ...prev, themeMode: themeMode === 'light' ? 'dark' : 'light'})),
        selected: themeMode !== 'dark',
      },
    ] satisfies GenericToggleButtonProps[]} />
  </>
}
