
export const meta = {
  id: "fullscreenToggle",
  group: ['header'],
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/toggle/FullscreenToggle'),
  priority: 80
};
