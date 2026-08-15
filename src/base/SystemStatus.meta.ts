import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'systemStatus',
  tool: [{ id: 'status-bar-primary', side: 'left', priority: 100 }],
  loader: () => import('@/base/SystemStatus'),
} as ToolMeta;
