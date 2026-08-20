import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "mapAll",
  tool: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 400
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/MapAllToggle'),
} as ToolMeta;
