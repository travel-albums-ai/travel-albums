import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "settingsModalToggle",
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/SettingsModalToggle'),
} as ToolbarMeta;
