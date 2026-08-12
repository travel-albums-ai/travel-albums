import type { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "previewPhotoTitle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 500
    }
  ],
  loader: () => import('@/tools/MixedTools/PreviewPhotoTitle'),
} as ToolbarMeta;
