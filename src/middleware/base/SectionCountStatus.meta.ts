import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'section-count-status',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 0,
  }],
  loader: () => import('@/middleware/base/SectionCountStatus'),
} as ToolMeta;
