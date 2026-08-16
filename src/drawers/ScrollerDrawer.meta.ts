import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'scroller', icon: Circle, loader: () => import('@/drawers/ScrollerDrawer') } as DrawerMeta;
