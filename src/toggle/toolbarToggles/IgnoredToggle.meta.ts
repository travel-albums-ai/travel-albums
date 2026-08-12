import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "ignoredToggle",
  toolbar: [
    {
      id: 'photo-drawer',
      side: 'left',
      priority: 300
    }
  ],
  loader: () => import('@/toggle/toolbarToggles/IgnoredToggle'),
} as ToolbarMeta;
