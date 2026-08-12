import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "favoriteToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 0
    },
    {
      id: 'album-photo-card',
      side: 'right',
      priority: 0,
      visible: (context: any) => context?.favorite === undefined ? false : context.favorite === true,
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/FavoriteToggle'),
} as ToolbarMeta;
