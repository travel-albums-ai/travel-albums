import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "drawersToggle",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 900
    }
  ],
  loader: () => import('@/tools/PopoverTools/DrawersToggle'),
} as ToolbarMeta;
