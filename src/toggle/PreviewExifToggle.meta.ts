import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "previewExifToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 100
    }
  ],
  loader: () => import('@/toggle/PreviewExifToggle'),
} as ToolbarMeta;
