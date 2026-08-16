import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'versionStatus',
  tool: [{ id: 'status-bar', side: 'right', priority: 600 }],
  loader: () => import('@/base/VersionStatus'),
} as ToolMeta;
