import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "navigation",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/ActionTools/NavigationToggle'),
} as ToolMeta;
