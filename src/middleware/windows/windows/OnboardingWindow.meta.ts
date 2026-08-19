import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'onboarding', loader: () => import('@/middleware/windows/OnboardingWindow'), enabled: true } as WindowMeta;
