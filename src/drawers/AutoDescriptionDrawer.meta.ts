import { DrawerMeta } from '@/drawerRegistry';

export const meta = { id: 'autoDescription', loader: () => import('@/drawers/AutoDescriptionDrawer') } as DrawerMeta;
