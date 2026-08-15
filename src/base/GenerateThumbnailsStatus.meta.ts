import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'generateThumbnailsStatus',
  tool: [{ id: 'status-bar-secondary', side: 'right', priority: 300 }],
  loader: () => import('@/base/GenerateThumbnailsStatus'),
} as ToolMeta;
