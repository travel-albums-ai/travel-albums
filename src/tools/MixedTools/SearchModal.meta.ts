import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "search-modal",
  tool: [
    {
      id: 'header',
      side: 'left',
      priority: 10
    }
  ],
  loader: () => import('@/tools/MixedTools/SearchModal'),
} as ToolMeta;
