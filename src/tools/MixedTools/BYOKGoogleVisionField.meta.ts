import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "byok-google-vision-field",
  toolbar: [
    {
      id: 'labeler-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/MixedTools/BYOKGoogleVisionField'),
} as ToolbarMeta;
