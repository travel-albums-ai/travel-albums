import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "thumbnailCover",
  toolbar: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'right',
      priority: 1200,
    })),
  ],
  loader: () => import('@/toggle/ThumbnailCoverToggle'),
} as ToolbarMeta;
