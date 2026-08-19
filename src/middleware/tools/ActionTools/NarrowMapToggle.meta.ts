import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "narrowMap",
  tool: [
    {
      id: 'globe-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/ActionTools/NarrowMapToggle'),
} as ToolMeta;
