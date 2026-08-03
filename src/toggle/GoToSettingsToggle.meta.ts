import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "goToSettings",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/toggle/GoToSettingsToggle'),
} as ToolbarMeta;
