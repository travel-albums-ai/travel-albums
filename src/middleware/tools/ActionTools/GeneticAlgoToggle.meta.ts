import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "geneticAlgoToggle",
  tool: [
    {
      id: 'adjustments-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/tools/ActionTools/GeneticAlgoToggle'),
} as ToolMeta;
