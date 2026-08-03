
export const meta = {
  id: "favoriteToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/FavoriteToggle'),
};
