
export const meta = {
  id: "darkLightStatus",
  group: ['header'],
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 600
    }
  ],
  loader: () => import('@/toggle/DarkLightStatus'),
  priority: 0
};
