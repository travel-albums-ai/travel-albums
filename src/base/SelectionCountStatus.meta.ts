import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: 'selection-count-status',
  tool: [{
    id: 'status-bar-primary',
    side: 'left',
    priority: 200,
    visible: (context: any) => context?.selectedPhotos === undefined ? false : context.selectedPhotos === true,
  }],
  loader: () => import('@/base/SelectionCountStatus'),
} as ToolMeta;
