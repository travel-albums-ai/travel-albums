import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'lightbox', loader: () => import('@/middlewar./middleware/windows/LightboxWindowNg'), enabled: true } as WindowMeta;
