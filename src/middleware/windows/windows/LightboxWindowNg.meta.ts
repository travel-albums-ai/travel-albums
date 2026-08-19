import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'lightbox', loader: () => import('@/middleware/windows/LightboxWindowNg'), enabled: true } as WindowMeta;
