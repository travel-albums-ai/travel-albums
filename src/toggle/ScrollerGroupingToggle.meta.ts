

export const meta = {
  id: "scroller-grouping-toggle",
  toolbar: [
    {
      id: 'scroller-drawer',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/toggle/ScrollerGroupingToggle'),
};
