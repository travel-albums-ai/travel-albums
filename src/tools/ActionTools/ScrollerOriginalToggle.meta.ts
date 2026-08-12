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
  loader: () => import('@/tools/ActionTools/ScrollerOriginalToggle'),
} as ToolbarMeta;
