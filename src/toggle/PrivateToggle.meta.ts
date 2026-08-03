

export const meta = {
  id: "privateToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 100
    }
  ],
  loader: () => import('@/toggle/PrivateToggle'),
};
