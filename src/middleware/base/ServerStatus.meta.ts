import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'serverStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 400 
  }],
  loader: () => import('@/middleware/base/ServerStatus'),
} as ToolMeta;
