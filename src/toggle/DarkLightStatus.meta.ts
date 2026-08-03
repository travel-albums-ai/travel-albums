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
  loader: () => import('@/toggle/DarkLightStatus'),
} as ToolbarMeta;
