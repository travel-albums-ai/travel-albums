import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "settingsModalToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/tools/ActionTools/SettingsModalToggle'),
} as ToolMeta;
