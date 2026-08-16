import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'section-count-status',
  tool: [{
    id: 'status-bar-secondary',
    side: 'right',
    priority: 0,
  }],
  loader: () => import('@/base/SectionCountStatus'),
} as ToolMeta;
