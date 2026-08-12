import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "selectionMode",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 300,
      visible: (context) => context?.selectMode === undefined ? false : context.selectMode === true,
    })),
  ],
  loader: () => import('@/toggle/toolbarToggles/SelectionToggle'),
} as ToolbarMeta;
