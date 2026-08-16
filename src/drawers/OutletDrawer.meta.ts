import { DrawerMeta } from '@/drawerRegistry';
import { PanelTopBottomDashed } from 'lucide-react';

export const meta = { id: 'outlet', icon: PanelTopBottomDashed, loader: () => import('@/drawers/OutletDrawer') } as DrawerMeta;
