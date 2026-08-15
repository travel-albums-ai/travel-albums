import type { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "previewPhotoTitle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 500
    }
  ],
  loader: () => import('@/tools/MixedTools/PreviewPhotoTitle'),
} as ToolMeta;
