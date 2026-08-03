
export const meta = {
  id: "labels-catalogue-popover",
  toolbar: [
    {
      id: 'labeler-drawer',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/toggle/LabelsCataloguePopover'),
};
