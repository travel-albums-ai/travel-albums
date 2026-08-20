import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "scroller-columns-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/ScrollerColumnsToggle'),
} as ToolMeta;
