import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'settings', loader: () => import('@/windows/SettingsWindow'), enabled: true } as WindowMeta;
