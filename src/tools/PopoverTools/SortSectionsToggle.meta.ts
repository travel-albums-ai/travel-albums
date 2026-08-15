import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "sortSectionsToggle",
  tool: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 0,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/tools/PopoverTools/SortSectionsToggle'),
} as ToolMeta;
