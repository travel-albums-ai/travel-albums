import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "labels-catalogue-popover",
  tool: [
    {
      id: 'labeler-drawer',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/tools/MixedTools/LabelsCataloguePopover'),
} as ToolMeta;
