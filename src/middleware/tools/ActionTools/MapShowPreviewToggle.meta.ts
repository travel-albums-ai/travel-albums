import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "mapShowPreview",
  tool: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 300
    }
  ],
  loader: () => import('@/tools/ActionTools/MapShowPreviewToggle'),
} as ToolMeta;
