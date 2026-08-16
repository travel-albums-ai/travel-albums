import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'preview', icon: Circle, loader: () => import('@/drawers/PhotoDrawer') } as DrawerMeta;
