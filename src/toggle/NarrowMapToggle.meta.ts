

export const meta = {
  id: "narrowMap",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/NarrowMapToggle'),
};
