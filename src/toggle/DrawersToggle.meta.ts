import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "drawersToggle",
  enabled: false,
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 900
    }
  ],
  loader: () => import('@/toggle/DrawersToggle'),
} as ToolbarMeta;
