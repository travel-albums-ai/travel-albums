import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'calendar', icon: Circle, loader: () => import('@/drawers/CalendarDrawer') } as DrawerMeta;
