import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "tutorial",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 800
    }
  ],
  loader: () => import('@/toggle/TutorialToggle'),
} as ToolbarMeta;
