import { InterfaceMeta } from '@/interfaceRegistry';
import { Image } from 'lucide-react';

export const meta = { id: 'preview', icon: Image, loader: () => import('@/middleware/interface/PhotoDrawer') } as InterfaceMeta;
