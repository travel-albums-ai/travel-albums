import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "allToFavoriteToggle",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 700,
      visible: (context) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/toggle/AllToFavoriteToggle'),
} as ToolbarMeta;
