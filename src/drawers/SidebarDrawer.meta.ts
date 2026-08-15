import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'sidebar', loader: () => import('@/drawers/SidebarDrawer') } as DrawerMeta;
