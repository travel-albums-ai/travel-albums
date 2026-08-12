import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "settingsToggle",
  toolbar: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 100,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/tools/PopoverTools/SettingsToggle'),
}  as ToolbarMeta;
