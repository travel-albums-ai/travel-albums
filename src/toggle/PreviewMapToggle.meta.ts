import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "previewMapToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/PreviewMapToggle'),
} as ToolbarMeta;
