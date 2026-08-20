import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: 'generateThumbnailsStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 300 
  }],
  loader: () => import('@/middleware/base/GenerateThumbnailsStatus'),
} as ToolMeta;
