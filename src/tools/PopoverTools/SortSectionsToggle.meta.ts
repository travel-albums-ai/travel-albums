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
  loader: () => import('@/tools/PopoverTools/SortSectionsToggle'),
} as ToolbarMeta;
