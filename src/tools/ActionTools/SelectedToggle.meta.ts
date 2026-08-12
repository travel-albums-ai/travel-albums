import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "selectedToggle",
  toolbar: [
    {
      id: 'album-photo-card',
      side: 'left',
      priority: 0,
      visible: (context: any) => context?.selectMode === undefined ? false : context.selectMode === true,
    },
    {
      id: 'album-photo-row',
      side: 'left',
      priority: 0,
      visible: (context: any) => context?.selectMode === undefined ? false : context.selectMode === true,
    }
  ],
  loader: () => import('@/tools/ActionTools/SelectedToggle'),
} as ToolbarMeta;
