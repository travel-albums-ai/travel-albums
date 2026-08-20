import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: 'versionStatus',
  tool: [{
    id: 'status-bar',
    side: 'right',
    priority: 600 
  }],
  loader: () => import('@/middleware/base/VersionStatus'),
} as ToolMeta;
