import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "search-modal",
  toolbar: [
    {
      id: 'header',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/toggle/toolbarFields/SearchModal'),
} as ToolbarMeta;
