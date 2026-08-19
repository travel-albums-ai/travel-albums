import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'settings', loader: () => import('@/middleware/windows/SettingsWindow'), enabled: true } as WindowMeta;
