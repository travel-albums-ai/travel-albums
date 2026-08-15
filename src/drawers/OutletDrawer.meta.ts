import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'outlet', loader: () => import('@/drawers/OutletDrawer') } as DrawerMeta;
