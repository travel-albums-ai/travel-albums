import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "themeMenu",
  tool: [
    // {
    //   id: 'header',
    //   side: 'right',
    //   priority: 1000
    // }
  ],
  loader: () => import('@/tools/PopoverTools/ThemeMenu'),
} as ToolMeta;
