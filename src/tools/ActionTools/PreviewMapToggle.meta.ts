import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "previewMapToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/tools/ActionTools/PreviewMapToggle'),
} as ToolMeta;
