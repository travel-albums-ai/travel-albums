import { DrawerMeta } from '@/drawerRegistry';
import { PaintRoller } from 'lucide-react';

export const meta = { id: 'adjustments', icon: PaintRoller, loader: () => import('@/drawers/AdjustmentsDrawer') } as DrawerMeta;
