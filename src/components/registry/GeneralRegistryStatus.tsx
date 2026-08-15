import { ensureToolGroupPreload } from '@/toolDiscovery';
import { ToolMeta, toolRegistry } from '@/toolRegistry';
import { Divider, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface GeneralRegistryStatusProps {
  group: string;
  side: 'left' | 'right';
  divider?: boolean;
  context?: unknown;
}

function getToolConfig(item: ToolMeta, side: 'left' | 'right') {
  return item.tool?.find((config) => config.side === side);
}

export default function GeneralRegistryStatus({ group, side, divider = true, context }: GeneralRegistryStatusProps) {
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

  const items = toolRegistry
    .toolBySide(group, side)
    .filter((item) => {
      const config = getToolConfig(item, side);
      return config?.visible ? config.visible(context) : true;
    });

  return (
    <Stack
      direction="row"
      sx={{ alignItems: 'center' }}
      spacing={1}
      divider={divider ? <Divider orientation="vertical" flexItem /> : undefined}
    >
      {items.map((item) => {
        const Component = toolRegistry.resolve(item);
        return Component ? <Component key={item.id} context={context} /> : null;
      })}
    </Stack>
  );
}
