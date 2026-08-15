import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "scroller-columns-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/tools/ActionTools/ScrollerColumnsToggle'),
} as ToolMeta;
