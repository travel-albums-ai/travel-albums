

export const meta = {
  id: "google-vision-labeler",
  toolbar: [
    {
      id: 'labeler-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/GoogleVisionLabeler'),
};
