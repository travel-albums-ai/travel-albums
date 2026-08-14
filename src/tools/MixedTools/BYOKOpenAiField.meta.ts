import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "byok-openai-field",
  toolbar: [
    {
      id: 'auto-description-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/MixedTools/BYOKOpenAiField'),
} as ToolbarMeta;
