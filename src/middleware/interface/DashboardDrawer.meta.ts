import { InterfaceMeta } from '@/interfaceRegistry';
import { LayoutDashboard } from 'lucide-react';

export const meta = {
  id: 'dashboard',
  icon: LayoutDashboard,
  loader: () => import('@/middleware/interface/DashboardDrawer') 
} as InterfaceMeta;
