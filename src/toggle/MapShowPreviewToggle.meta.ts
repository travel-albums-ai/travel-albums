

export const meta = {
  id: "mapShowPreview",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 300
    }
  ],
  loader: () => import('@/toggle/MapShowPreviewToggle'),
};
