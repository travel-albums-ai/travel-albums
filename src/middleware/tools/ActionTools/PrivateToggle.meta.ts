import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "privateToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 100
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PrivateToggle'),
} as ToolMeta;
