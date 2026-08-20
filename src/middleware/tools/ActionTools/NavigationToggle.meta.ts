import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "navigation",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/NavigationToggle'),
} as ToolMeta;
