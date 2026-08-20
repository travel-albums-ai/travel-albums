import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'thumbSizeStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 200
  }],
  loader: () => import('@/middleware/base/ThumbSizeStatus'),
} as ToolMeta;
