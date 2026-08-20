import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "previewExifToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 100
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PreviewExifToggle'),
} as ToolMeta;
