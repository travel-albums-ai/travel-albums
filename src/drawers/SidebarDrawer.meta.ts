import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'sidebar', icon: Circle, loader: () => import('@/drawers/SidebarDrawer') } as DrawerMeta;
