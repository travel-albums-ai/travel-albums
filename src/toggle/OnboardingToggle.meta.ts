import { ToolbarMeta } from '@/toolbarRegistry';

export const meta = {
  id: "onboardingToggle",
  toolbar: [
    // {
    //   id: 'photo-drawer',
    //   side: 'right',
    //   priority: 200
    // }
  ],
  loader: () => import('@/toggle/OnboardingToggle'),
} as ToolbarMeta;
