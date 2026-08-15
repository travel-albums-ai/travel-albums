import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'adjustments', loader: () => import('@/drawers/AdjustmentsDrawer') } as DrawerMeta;
