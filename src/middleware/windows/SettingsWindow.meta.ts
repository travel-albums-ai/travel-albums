import { WindowMeta } from '@/discovery/windowRegistry';

export const meta = {
  id: 'settings',
  loader: () => import('@/middleware/windows/SettingsWindow'),
  enabled: true 
} as WindowMeta;
