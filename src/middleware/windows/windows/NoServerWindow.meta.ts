import { WindowMeta } from '@/windowRegistry';

export const meta = { id: 'noServer', loader: () => import('@/middlewar./middleware/windows/NoServerWindow'), enabled: true } as WindowMeta;
