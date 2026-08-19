import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "fullscreenToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/tools/ActionTools/FullscreenToggle'),
} as ToolMeta;
