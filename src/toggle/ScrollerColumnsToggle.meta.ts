import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "scroller-columns-toggle",
  toolbar: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/toggle/ScrollerColumnsToggle'),
} as ToolbarMeta;
