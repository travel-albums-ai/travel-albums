import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'onboarding', loader: () => import('@/middlewar./middleware/windows/OnboardingWindow'), enabled: true } as WindowMeta;
