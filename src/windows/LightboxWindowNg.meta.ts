import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'lightbox', loader: () => import('@/windows/LightboxWindowNg'), enabled: true } as WindowMeta;
