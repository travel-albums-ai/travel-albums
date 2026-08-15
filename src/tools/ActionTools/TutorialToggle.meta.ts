import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "tutorial",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/tools/ActionTools/TutorialToggle'),
} as ToolMeta;
