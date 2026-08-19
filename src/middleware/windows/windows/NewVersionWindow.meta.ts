import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'newVersion', loader: () => import('@/middlewar./middleware/windows/NewVersionWindow'), enabled: true } as WindowMeta;
