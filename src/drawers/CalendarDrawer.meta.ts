import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'calendar', loader: () => import('@/drawers/CalendarDrawer') } as DrawerMeta;
