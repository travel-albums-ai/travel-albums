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
  loader: () => import('@/tools/ActionTools/TutorialToggle'),
} as ToolbarMeta;
