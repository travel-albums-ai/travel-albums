import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "darkLightStatus",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 600
    }
  ],
  loader: () => import('@/tools/ActionTools/DarkLightStatus'),
} as ToolMeta;
