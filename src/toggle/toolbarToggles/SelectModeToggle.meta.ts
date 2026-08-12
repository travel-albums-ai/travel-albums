import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "selectMode",
  toolbar: [
    {
      id: 'selected-photos-drawer',
      side: 'left',
      priority: 100
    },
    {
      id: 'scroller-drawer',
      side: 'left',
      priority: 200
    },
    {
      id: 'rows-drawer',
      side: 'left',
      priority: 300
    },
    {
      id: 'calendar-drawer',
      side: 'left',
      priority: 400
    },
  ],
  loader: () => import('@/toggle/toolbarToggles/SelectModeToggle'),
}  as ToolbarMeta;
