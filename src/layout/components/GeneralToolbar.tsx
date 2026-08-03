import { ensureToolbarDiscovery } from '@/toolbarDiscovery';
import {
  ToolbarMeta,
  toolbarRegistry,
} from '@/toolbarRegistry';
import {
  Box,
  Button,
  Divider,
  Skeleton,
  Stack,
  SxProps,
  Theme,
  Typography,
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
  const [error, setError] = useState<Error | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    if (ready) {
      return;
    }

    let mounted = true;
    setError(null);

    ensureToolbarDiscovery()
      .then(() => {
        if (mounted) {
          setReady(true);
        }
      })
      .catch((cause) => {
        if (!mounted) {
          return;
        }

        const discoveryError = cause instanceof Error
          ? cause
          : new Error('Toolbar discovery failed');
        setError(discoveryError);
      });

    return () => {
      mounted = false;
    };
  }, [ready, retryToken]);

  if (!ready) {
    if (error) {
      return (
        <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ width: '100%', justifyContent: 'space-between' }}>
            <Typography variant="caption" color="text.secondary">
              Failed to load toolbar controls.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => setRetryToken((value) => value + 1)}
            >
              Retry
            </Button>
          </Stack>
        </Box>
      );
    }

    return <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx, }}>
      <Skeleton variant="rounded" width="100%" height={38} />
    </Box>;
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
