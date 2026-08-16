import { DrawerMeta } from '@/drawerRegistry';
import { Calendar } from 'lucide-react';

export const meta = { id: 'calendar', icon: Calendar, loader: () => import('@/drawers/CalendarDrawer') } as DrawerMeta;
