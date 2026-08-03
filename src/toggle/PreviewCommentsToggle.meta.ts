
export const meta = {
  id: "previewCommentsToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 200
    }
  ],
  loader: () => import('@/toggle/PreviewCommentsToggle'),
};
