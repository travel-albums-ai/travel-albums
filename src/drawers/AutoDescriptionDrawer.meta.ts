import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'autoDescription', icon: Circle, loader: () => import('@/drawers/AutoDescriptionDrawer') } as DrawerMeta;
