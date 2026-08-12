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
  loader: () => import('@/toggle/toolbarFields/SearchModal'),
} as ToolbarMeta;
