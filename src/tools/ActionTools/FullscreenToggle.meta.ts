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
  loader: () => import('@/tools/ActionTools/FullscreenToggle'),
} as ToolbarMeta;
