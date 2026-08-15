import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "thumbnailCover",
  tool: [
    ...['rows-drawer', 'selected-photos-drawer', 'scroller-drawer', 'calendar-drawer'].map(id => ({
      id,
      side: 'right',
      priority: 1200,
    })),
  ],
  loader: () => import('@/tools/ActionTools/ThumbnailCoverToggle'),
} as ToolMeta;
