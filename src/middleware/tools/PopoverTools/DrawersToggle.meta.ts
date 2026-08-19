import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "drawersToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 900
    }
  ],
  loader: () => import('@/middleware/tools/PopoverTools/DrawersToggle'),
} as ToolMeta;
