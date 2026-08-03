

export const meta = {
  id: "extendedMenu",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 1000
    }
  ],
  loader: () => import('@/toggle/ExtendedMenu'),
};
