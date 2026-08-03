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
import { Suspense } from 'react';

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
  const registry = toolbarRegistry.toolbar(group);

  console.log('GeneralToolbar', group, registry);

  const leftItems = registry
    .filter((x) => x.toolbar?.some((g) => g.side === 'left'))
    .filter((item) => {
      const config = getToolbarConfig(item, 'left');
      return config?.visible ? config.visible(context) : true;
    });

  const rightItems = registry
    .filter((x) => x.toolbar?.some((g) => g.side === 'right'))
    .filter((item) => {
      const config = getToolbarConfig(item, 'right');
      return config?.visible ? config.visible(context) : true;
    });

  return (
    <Stack sx={{ ...wrapperSx, ...sx, width: fullWidth ? '100%' : 'auto' }} divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} direction="row" id="header">
      {leftItems.length > 0 && <Box sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        {leftItems
          .sort((a, b) => (getToolbarConfig(a, 'left')?.priority ?? 0) - (getToolbarConfig(b, 'left')?.priority ?? 0))
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            return (
              <Suspense key={item.id} fallback={null}>
                <Component context={context} />
              </Suspense>
            );
          })

        }
      </Box>}
      {rightItems.length > 0 && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {rightItems
          .sort((a, b) => (getToolbarConfig(a, 'right')?.priority ?? 0) - (getToolbarConfig(b, 'right')?.priority ?? 0))
          .map((item) => {
            const Component = toolbarRegistry.resolve(item);

            return (
              <Suspense key={item.id} fallback={null}>
                <Component context={context} />
              </Suspense>
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
