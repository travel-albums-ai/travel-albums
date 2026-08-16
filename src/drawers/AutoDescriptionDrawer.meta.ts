import { DrawerMeta } from '@/drawerRegistry';
import { Astroid } from 'lucide-react';

export const meta = { id: 'autoDescription', icon: Astroid, loader: () => import('@/drawers/AutoDescriptionDrawer') } as DrawerMeta;
