
export const meta = {
  id: "drawersToggle",
  group: ['header'],
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 900
    }
  ],
  loader: () => import('@/toggle/DrawersToggle'),
  priority: 90
};
