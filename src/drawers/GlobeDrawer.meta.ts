import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'globe', loader: () => import('@/drawers/GlobeDrawer') } as DrawerMeta;
