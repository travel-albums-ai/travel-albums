import { WindowMeta } from '@/windowRegistry';

export const meta = {
  id: 'noServer',
  loader: () => import('@/middleware/windows/NoServerWindow'),
  enabled: true 
} as WindowMeta;
