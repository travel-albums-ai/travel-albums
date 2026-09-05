import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: "pipelineWindowToggle",
  tool: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/PipelineWindowToggle'),
} as ToolMeta;
