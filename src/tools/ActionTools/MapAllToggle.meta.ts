import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "mapAll",
  tool: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 400
    }
  ],
  loader: () => import('@/tools/ActionTools/MapAllToggle'),
} as ToolMeta;
