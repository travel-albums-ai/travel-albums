import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: 'thumbSizeStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 200 
  }],
  loader: () => import('@/middleware/base/ThumbSizeStatus'),
} as ToolMeta;
