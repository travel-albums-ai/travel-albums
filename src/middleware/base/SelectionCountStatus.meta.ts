import type { ToolMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'selection-count-status',
  tool: [{
    id: 'status-bar',
    side: 'left',
    priority: 200,
    visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
  }],
  loader: () => import('@/middleware/base/SelectionCountStatus'),
} as ToolMeta;
