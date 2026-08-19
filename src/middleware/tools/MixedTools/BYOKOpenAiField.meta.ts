import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "byok-openai-field",
  tool: [
    {
      id: 'auto-description-drawer',
      side: 'left',
      priority: 0
    }
  ],
  loader: () => import('@/tools/MixedTools/BYOKOpenAiField'),
} as ToolMeta;
