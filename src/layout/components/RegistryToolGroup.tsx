import { ensureToolGroupPreload } from '@/toolDiscovery';
import { toolRegistry } from '@/toolRegistry';
import { Divider, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface RegistryToolGroupProps {
  group: string;
  side: 'left' | 'right';
  divider?: boolean;
}

export default function RegistryToolGroup({ group, side, divider = true }: RegistryToolGroupProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    ensureToolGroupPreload(group).then(() => {
      if (mounted) {
        setReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [group]);

  if (!ready) {
    return null;
  }

  const items = toolRegistry.toolBySide(group, side);

  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center' }}
      spacing={1}
      divider={divider ? <Divider orientation="vertical" flexItem /> : undefined}
    >
      {items.map((item) => {
        const Component = toolRegistry.resolve(item);
        console.log('RegistryToolGroup', group, side, item.id, Component);
        return Component ? <>{item.id} <Component key={item.id} /></> : null;
      })}
    </Stack>
  );
}
