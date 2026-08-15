import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'preview', loader: () => import('@/drawers/PhotoDrawer') } as DrawerMeta;
