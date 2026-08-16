import { DrawerMeta } from '@/drawerRegistry';
import { FileSearch } from 'lucide-react';

export const meta = { id: 'sidebar', icon: FileSearch, loader: () => import('@/drawers/SidebarDrawer') } as DrawerMeta;
