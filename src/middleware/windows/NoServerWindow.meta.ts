import { WindowMeta } from '@/discovery/registryTypes';

export const meta = {
  id: 'noServer',
  loader: () => import('@/middleware/windows/NoServerWindow'),
  enabled: true
} as WindowMeta;
