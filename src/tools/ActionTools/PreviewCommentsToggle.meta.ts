import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "previewCommentsToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 200
    }
  ],
  loader: () => import('@/tools/ActionTools/PreviewCommentsToggle'),
} as ToolMeta;
