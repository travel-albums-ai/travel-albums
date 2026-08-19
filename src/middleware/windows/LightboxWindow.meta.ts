import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'lightbox', loader: () => import('@/middleware/windows/NewVersionWindow'), enabled: true } as WindowMeta;
