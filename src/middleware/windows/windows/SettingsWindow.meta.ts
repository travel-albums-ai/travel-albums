import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'settings', loader: () => import('@/middlewar./middleware/windows/SettingsWindow'), enabled: true } as WindowMeta;
