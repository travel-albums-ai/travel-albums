import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "mapShowPreview",
  toolbar: [
    {
      id: 'globe-drawer',
      side: 'right',
      priority: 300
    }
  ],
  loader: () => import('@/tools/ActionTools/MapShowPreviewToggle'),
} as ToolbarMeta;
