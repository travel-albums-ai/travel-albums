import { ToolMeta } from '@/toolRegistry';

export const meta = {
  id: "onboardingToggle",
  tool: [
    {
      id: 'settings-page',
      side: 'left',
      priority: 200
    }
  ],
  loader: () => import('@/tools/ActionTools/OnboardingToggle'),
} as ToolMeta;
