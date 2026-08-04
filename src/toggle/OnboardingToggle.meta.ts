import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "onboardingToggle",
  toolbar: [
    {
      id: 'settings-page',
      side: 'left',
      priority: 200
    }
  ],
  loader: () => import('@/toggle/OnboardingToggle'),
} as ToolbarMeta;
