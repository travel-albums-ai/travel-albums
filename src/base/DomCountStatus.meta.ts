import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'domCountStatus',
  tool: [{ id: 'status-bar', side: 'right', priority: 1100 }],
  loader: () => import('@/base/DomCountStatus'),
} as ToolMeta;
