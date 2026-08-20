import { WindowMeta } from '@/discovery/windowRegistry';

export const meta = {
  id: 'lightbox',
  loader: () => import('@/middleware/windows/LightboxWindow'),
  enabled: true 
} as WindowMeta;
