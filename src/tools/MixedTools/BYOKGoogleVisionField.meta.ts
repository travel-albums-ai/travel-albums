import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "byok-google-vision-field",
  tool: [
    {
      id: 'labeler-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/MixedTools/BYOKGoogleVisionField'),
} as ToolMeta;
