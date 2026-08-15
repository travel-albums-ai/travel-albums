import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "extendedMenu",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 1000
    }
  ],
  loader: () => import('@/tools/PopoverTools/ExtendedMenu'),
} as ToolMeta;
