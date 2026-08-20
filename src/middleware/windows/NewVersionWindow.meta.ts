import { WindowMeta } from '@/discovery/windowRegistry';

export const meta = {
  id: 'newVersion',
  loader: () => import('@/middleware/windows/NewVersionWindow'),
  enabled: true 
} as WindowMeta;
