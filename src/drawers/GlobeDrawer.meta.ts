import { DrawerMeta } from '@/drawerRegistry';
import { Earth } from 'lucide-react';

export const meta = { id: 'globe', icon: Earth, loader: () => import('@/drawers/GlobeDrawer') } as DrawerMeta;
