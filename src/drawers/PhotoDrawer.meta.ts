import { DrawerMeta } from '@/drawerRegistry';
import { Image } from 'lucide-react';

export const meta = { id: 'preview', icon: Image, loader: () => import('@/drawers/PhotoDrawer') } as DrawerMeta;
