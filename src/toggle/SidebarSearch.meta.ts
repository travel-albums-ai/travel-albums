import { ToolbarMeta } from '@/toolbarRegistry';
export const meta = {
  id: "sidebarSearch",
  group: ['sidebar'],
  toolbar: [
    {
      id: 'sidebar',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/SidebarSearch'),
  priority: 70
} as ToolbarMeta;
