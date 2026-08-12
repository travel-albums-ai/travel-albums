import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "searchFiltersToggle",
  toolbar: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 200,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/tools/PopoverTools/SearchFiltersToggle'),
} as ToolbarMeta;
