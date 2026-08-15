import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'thumbSizeStatus',
  tool: [{ id: 'status-bar-secondary', side: 'right', priority: 200 }],
  loader: () => import('@/base/ThumbSizeStatus'),
} as ToolMeta;
