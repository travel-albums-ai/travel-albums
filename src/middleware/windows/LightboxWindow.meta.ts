import { WindowMeta } from '@/windowRegistry';

export const meta = {
  id: 'lightbox',
  loader: () => import('@/middleware/windows/LightboxWindow'),
  enabled: true 
} as WindowMeta;
