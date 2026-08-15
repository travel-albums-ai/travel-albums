import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "ignoredToggle",
  tool: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 300
    }
  ],
  loader: () => import('@/tools/ActionTools/IgnoredToggle'),
} as ToolMeta;
