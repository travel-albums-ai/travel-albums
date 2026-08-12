import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "search-modal",
  toolbar: [
    {
      id: 'header',
      side: 'left',
      priority: 10
    }
  ],
  loader: () => import('@/tools/MixedTools/SearchModal'),
} as ToolbarMeta;
