import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'scroller', loader: () => import('@/drawers/ScrollerDrawer') } as DrawerMeta;
