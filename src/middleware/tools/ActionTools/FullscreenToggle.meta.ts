import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "fullscreenToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 700
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/FullscreenToggle'),
} as ToolMeta;
