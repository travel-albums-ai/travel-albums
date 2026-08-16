import { DrawerMeta } from '@/drawerRegistry';
import { Circle } from 'lucide-react';

export const meta = { id: 'globe', icon: Circle, loader: () => import('@/drawers/GlobeDrawer') } as DrawerMeta;
