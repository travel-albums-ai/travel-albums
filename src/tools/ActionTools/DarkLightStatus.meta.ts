import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "darkLightStatus",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 600
    }
  ],
  loader: () => import('@/tools/ActionTools/DarkLightStatus'),
} as ToolbarMeta;
