import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "goToSettings",
  enabled: false,
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/toggle/toolbarFields/GoToSettingsToggle'),
} as ToolbarMeta;
