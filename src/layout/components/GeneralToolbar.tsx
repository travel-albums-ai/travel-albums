import { ensureToolbarDiscovery } from '@/toolbarDiscovery';
import {
  ToolbarMeta,
  toolbarRegistry,
} from '@/toolbarRegistry';
import {
  Box,
  Divider,
  Stack,
  SxProps,
  Theme,
} from '@mui/material';
import { useEffect, useState } from 'react';

interface GeneralToolbarProps {
  group: string;
  noDivider?: boolean;
  fullWidth?: boolean;
  sx?: SxProps<Theme>;
  context?: unknown;
}

function getToolbarConfig(item: ToolbarMeta, side: 'left' | 'right') {
  return item.toolbar?.find((g) => g.side === side);
}

export default function GeneralToolbar({ group, noDivider, fullWidth = true, sx, context }: GeneralToolbarProps) {
  const [ready, setReady] = useState(() => toolbarRegistry.hasItems());

  useEffect(() => {
    if (ready) {
      return;
    }

    let mounted = true;

    ensureToolbarDiscovery().then(() => {
      if (mounted) {
        setReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, [ready]);

  if (!ready) {
    return null;
  }

  const leftItems = toolbarRegistry
    .toolbarBySide(group, 'left')
    .filter((item) => {
      const config = getToolbarConfig(item, 'left');
      return config?.visible ? config.visible(context) : true;
    });

  const rightItems = toolbarRegistry
    .toolbarBySide(group, 'right')
    .filter((item) => {
      const config = getToolbarConfig(item, 'right');
      return config?.visible ? config.visible(context) : true;
    });

  return (
    <Stack sx={{ ...wrapperSx, ...sx, width: fullWidth ? '100%' : 'auto' }} divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} direction="row" id="header">
      {leftItems.length > 0 && <Box sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        {leftItems
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            if (!Component) {
              return null;
            }

            return (
              <Component key={item.id} context={context} />
            );
          })

        }
      </Box>}
      {rightItems.length > 0 && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {rightItems
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            if (!Component) {
              return null;
            }

            return (
              <Component key={item.id} context={context} />
            );
          })}
      </Box>}
    </Stack>
  );
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
}
