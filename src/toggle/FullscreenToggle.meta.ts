import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "fullscreenToggle",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/toggle/FullscreenToggle'),
} as ToolbarMeta;
