import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "scroller-rows-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/tools/ActionTools/ScrollerRowsToggle'),
} as ToolMeta;
