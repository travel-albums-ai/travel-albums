import { ToolMeta } from '@/discovery/toolRegistry';

export const meta = {
  id: "onboardingToggle",
  tool: [
    {
      id: 'settings-page',
      side: 'left',
      priority: 200
    }
  ],
  loader: () => import('@/middleware/tools/ActionTools/OnboardingToggle'),
} as ToolMeta;
