import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'rows', icon: Circle, loader: () => import('@/drawers/RowsDrawer') } as DrawerMeta;
