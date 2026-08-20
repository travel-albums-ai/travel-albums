import { WindowMeta } from '@/windowRegistry';

export const meta = {
  id: 'newVersion',
  loader: () => import('@/middleware/windows/NewVersionWindow'),
  enabled: true 
} as WindowMeta;
