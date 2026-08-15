import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'domCountStatus',
  tool: [{ id: 'status-bar-secondary', side: 'right', priority: 100 }],
  loader: () => import('@/base/DomCountStatus'),
} as ToolMeta;
