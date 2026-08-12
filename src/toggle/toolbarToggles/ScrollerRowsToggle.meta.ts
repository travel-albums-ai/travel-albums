import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "scroller-rows-toggle",
  toolbar: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/ScrollerRowsToggle'),
} as ToolbarMeta;
