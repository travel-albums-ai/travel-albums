import { ensureToolbarGroupPreload } from '@/toolbarDiscovery';
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

export default function GeneralToolbar({ group, noDivider = true, fullWidth = true, sx, context }: GeneralToolbarProps) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryToken, setRetryToken] = useState(0);

  useEffect(() => {
    let mounted = true;

    queueMicrotask(() => {
      if (mounted) {
        setReady(false);
      }
    });

    ensureToolbarGroupPreload(group)
      .then(() => {
        if (mounted) {
          setError(null);
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
  }, [group, retryToken]);

  if (!ready) {
    if (error) {
      return (
        <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx }}>
          <Stack direction="row" spacing={1} sx={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" color="text.secondary">
              Failed to load toolbar controls.
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                setError(null);
                setReady(false);
                setRetryToken((value) => value + 1);
              }}
            >
              Retry
            </Button>
          </Stack>
        </Box>
      );
    }

    return <Box sx={{ ...wrapperSx, minHeight: '38px', width: fullWidth ? '100%' : 'auto', ...sx, }}>
      <Skeleton variant="rounded" width="100%" animation="wave" height={38} />
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
    <Stack sx={{ ...wrapperSx, ...sx, width: fullWidth ? '100%' : 'auto' }} data-group={group} divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} direction="row" id="header">
      {leftItems.length > 0 && <Box data-side="left" sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        {leftItems
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            return !Component ? null : <Component key={item.id} context={context} />
          })}
      </Box>}
      {rightItems.length > 0 && <Box data-side="right" sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {rightItems
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            return !Component ? null : <Component key={item.id} context={context} />
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
