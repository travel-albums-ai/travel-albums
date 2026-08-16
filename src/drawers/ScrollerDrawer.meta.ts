import { DrawerMeta } from '@/drawerRegistry';
import { GalleryHorizontal } from 'lucide-react';

export const meta = { id: 'scroller', icon: GalleryHorizontal, loader: () => import('@/drawers/ScrollerDrawer') } as DrawerMeta;
