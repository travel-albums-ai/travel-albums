import { DrawerMeta } from '@/drawerRegistry';
import { LayoutDashboard } from 'lucide-react';

export const meta = { id: 'dashboard', icon: LayoutDashboard, loader: () => import('@/drawers/DashboardDrawer') } as DrawerMeta;
