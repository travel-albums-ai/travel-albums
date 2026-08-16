import { DrawerMeta } from '@/drawerRegistry';
import { LayoutList } from 'lucide-react';

export const meta = { id: 'rows', icon: LayoutList, loader: () => import('@/drawers/RowsDrawer') } as DrawerMeta;
