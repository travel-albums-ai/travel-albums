import { ToolbarMeta } from '@/toolbarRegistry';
export const meta = {
  id: "sidebarSearch",
  toolbar: [
    {
      id: 'sidebar',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/MixedTools/SidebarSearch'),
} as ToolbarMeta;
