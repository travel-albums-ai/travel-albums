import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "allToPrivateToggle",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'left',
      priority: 900,
      visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
    })),
  ],
  loader: () => import('@/tools/ActionTools/AllToPrivateToggle'),
} as ToolbarMeta;
