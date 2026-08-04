import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "geneticAlgoToggle",
  toolbar: [
    {
      id: 'adjustments-drawer',
      side: 'right',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/GeneticAlgoToggle'),
} as ToolbarMeta;
