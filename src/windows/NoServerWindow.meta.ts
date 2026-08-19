import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'noServer', loader: () => import('@/windows/NoServerWindow'), enabled: true } as WindowMeta;
