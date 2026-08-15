import { drawerRegistry } from '@/drawerRegistry';
import { useEffect, useState } from 'react';

interface RegistryDrawerProps {
  id: string;
}

export default function RegistryDrawer({ id }: RegistryDrawerProps) {
  const [component, setComponent] = useState<React.ComponentType | null>(null);

  useEffect(() => {
    let mounted = true;
    const meta = drawerRegistry.get(id);

    if (!meta) {
      return () => {
        mounted = false;
      };
    }

    drawerRegistry.preload(meta).then((loadedComponent) => {
      if (mounted) {
        setComponent(() => loadedComponent);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!component) {
    return null;
  }

  const Component = component;
  return <Component />;
}
