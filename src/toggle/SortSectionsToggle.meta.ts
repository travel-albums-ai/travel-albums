import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "sortSectionsToggle",
  toolbar: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 0,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/toggle/SortSectionsToggle'),
} as ToolbarMeta;
