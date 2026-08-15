import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "scroller-original-toggle",
  tool: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 1100
    }
  ],
  loader: () => import('@/tools/ActionTools/ScrollerOriginalToggle'),
} as ToolMeta;
