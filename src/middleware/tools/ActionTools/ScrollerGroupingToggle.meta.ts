import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "scroller-grouping-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/ScrollerGroupingToggle'),
} as ToolMeta;
