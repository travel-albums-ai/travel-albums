import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'newVersion', loader: () => import('@/windows/NewVersionWindow'), enabled: true } as WindowMeta;
