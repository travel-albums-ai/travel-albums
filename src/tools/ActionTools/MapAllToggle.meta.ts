import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "mapAll",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 400
    }
  ],
  loader: () => import('@/tools/ActionTools/MapAllToggle'),
} as ToolbarMeta;
