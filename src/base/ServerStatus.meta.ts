import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'serverStatus',
  tool: [{ id: 'status-bar-secondary', side: 'right', priority: 400 }],
  loader: () => import('@/base/ServerStatus'),
} as ToolMeta;
