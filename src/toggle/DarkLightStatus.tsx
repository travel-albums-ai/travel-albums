import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import useRegisterTool from '@/hooks/useRegisterTool';
import { MoonStar, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWebMCP } from 'usewebmcp';

export default function DarkLightStatus() {
  const { setSetting } = useSettings()
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const { t } = useTranslation()


  useWebMCP({
    name: 'check_theme_mode_mcp',
    description: 'Get current theme mode',
    execute: async () => ({
      structuredContent: {
        themeMode: themeMode,
      },
      content: [{
        type: "text",
        text: `Current theme mode is ${themeMode}.`
      }]
    })
  });

  useRegisterTool(
    {
      name: 'toggle_theme',
      description:
        'Switch the application between light and dark theme, or toggle the current theme.',
      inputSchema: {
        type: 'object',
        properties: {
          mode: {
            type: 'string',
            enum: ['light', 'dark', 'toggle'],
            description: 'Theme to switch to. Defaults to "toggle" if omitted.',
          },
        },
      },
      execute: async ({ mode = 'toggle' }: { mode?: 'light' | 'dark' | 'toggle' }) => {
        const nextTheme =
          mode === 'toggle' ? (themeMode === 'light' ? 'dark' : 'light') : mode;

        setSetting((prev) => ({
          ...prev,
          themeMode: nextTheme,
        }));

        return {
          content: [
            {
              type: 'text',
              text: `Theme switched to ${nextTheme}.`,
            },
          ],
        };
      },
    },
    [themeMode, setSetting]
  );

  return <GenericToggleButtonGroup variant="standard" items={[
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
}
