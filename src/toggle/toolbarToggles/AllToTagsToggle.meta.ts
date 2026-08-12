import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "allToTagsToggle",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 1000,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/toggle/toolbarToggles/AllToTagsToggle'),
} as ToolbarMeta;
