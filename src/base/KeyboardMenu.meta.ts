import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'keyboardMenu',
  tool: [{ id: 'status-bar-secondary', side: 'right', priority: 500 }],
  loader: () => import('@/base/KeyboardMenu'),
} as ToolMeta;
