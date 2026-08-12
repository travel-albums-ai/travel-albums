import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "allToIgnoreToggle",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 800,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/toggle/toolbarToggles/AllToIgnoreToggle'),
} as ToolbarMeta;
