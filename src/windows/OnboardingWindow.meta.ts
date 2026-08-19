import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'onboarding', loader: () => import('@/windows/OnboardingWindow'), enabled: true } as WindowMeta;
