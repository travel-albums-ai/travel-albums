import { toolbarRegistry } from '@/toolbarRegistry';
import { Box, Divider, Stack } from '@mui/material';

export default function GeneralToolbar({ group, noDivider, sx, context }: { group: string, noDivider?: boolean, sx?: any, context?: any }) {
  const registry = toolbarRegistry.toolbar(group)

  const leftItems = registry
    .filter(x => x.toolbar?.some(g => g.side === 'left'))
    .filter(item => item.component)
    .filter(item => item.toolbar?.find(g => g.side === 'left')?.visible ? item.toolbar?.find(g => g.side === 'left')?.visible(context) : true)

  const rightItems = registry
    .filter(x => x.toolbar?.some(g => g.side === 'right'))
    .filter(item => item.component)
    .filter(item => item.toolbar?.find(g => g.side === 'right')?.visible ? item.toolbar?.find(g => g.side === 'right')?.visible(context) : true)

  return (
    <Stack sx={{ ...wrapperSx, ...sx }} divider={!noDivider ? <Divider orientation="vertical" flexItem /> : undefined} direction="row" id="header">
      {leftItems.length > 0 && <Box sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        {leftItems
          .sort((a, b) => (a.toolbar?.find(g => g.side === 'left')?.priority ?? 0) - (b.toolbar?.find(g => g.side === 'left')?.priority ?? 0))
          .map((item) => <item.component key={item.id} context={context} />)}
      </Box>}
      {rightItems.length > 0 && <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {rightItems
          .sort((a, b) => (a.toolbar?.find(g => g.side === 'right')?.priority ?? 0) - (b.toolbar?.find(g => g.side === 'right')?.priority ?? 0))
          .map((item) => <item.component key={item.id} context={context} />)}
      </Box>}
    </Stack>
  )
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
}
