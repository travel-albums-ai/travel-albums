import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'outlet', icon: Circle, loader: () => import('@/drawers/OutletDrawer') } as DrawerMeta;
