import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "sort-order-toggle",
  toolbar: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 0
    },
  ],
  loader: () => import('@/tools/ActionTools/SortOrderToggle'),
} as ToolbarMeta;
