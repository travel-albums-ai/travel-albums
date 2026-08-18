import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "reload_toggle",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 10
    }
  ],
  loader: () => import('@/tools/ActionTools/ReloadToggle'),
} as ToolMeta;
