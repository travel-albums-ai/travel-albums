import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'selection-count-status',
  tool: [{
    id: 'status-bar-primary',
    side: 'left',
    priority: 200,
  }],
  loader: () => import('@/base/SelectionCountStatus'),
} as ToolMeta;
