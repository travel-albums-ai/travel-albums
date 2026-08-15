import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'rows', loader: () => import('@/drawers/RowsDrawer') } as DrawerMeta;
