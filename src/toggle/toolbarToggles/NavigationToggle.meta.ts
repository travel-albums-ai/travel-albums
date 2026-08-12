import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "navigation",
  toolbar: [
    {
      id: 'header',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/NavigationToggle'),
} as ToolbarMeta;
