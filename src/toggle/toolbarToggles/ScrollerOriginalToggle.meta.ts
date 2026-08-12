import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "scroller-original-toggle",
  toolbar: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 1100
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/ScrollerOriginalToggle'),
} as ToolbarMeta;
