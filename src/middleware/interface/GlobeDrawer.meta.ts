import { InterfaceMeta } from '@/interfaceRegistry';
import { Earth } from 'lucide-react';

export const meta = { id: 'globe', icon: Earth, loader: () => import('@/middleware/interface/GlobeDrawer') } as InterfaceMeta;
