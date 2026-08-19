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
  loader: () => import('@/tools/PopoverTools/DrawersToggle'),
} as ToolMeta;
