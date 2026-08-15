import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "searchFiltersToggle",
  tool: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 200,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/tools/PopoverTools/SearchFiltersToggle'),
} as ToolMeta;
