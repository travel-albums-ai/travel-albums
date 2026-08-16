import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'adjustments', icon: Circle, loader: () => import('@/drawers/AdjustmentsDrawer') } as DrawerMeta;
