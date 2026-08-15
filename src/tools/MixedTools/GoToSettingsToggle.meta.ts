import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "goToSettings",
  enabled: false,
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/tools/MixedTools/GoToSettingsToggle'),
} as ToolMeta;
