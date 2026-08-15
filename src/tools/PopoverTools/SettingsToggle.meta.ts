import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "settingsToggle",
  tool: [
    {
      id: 'sidebar',
      side: 'right',
      priority: 100,
      visible: (context: any) => !context.sidebarSearchOpen,
    }
  ],
  loader: () => import('@/tools/PopoverTools/SettingsToggle'),
}  as ToolMeta;
