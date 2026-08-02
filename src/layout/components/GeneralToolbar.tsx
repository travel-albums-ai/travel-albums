import { toolbarRegistry } from '@/toolbarRegistry';
import { Box, Divider, Stack, Theme } from '@mui/material';
import { Fragment } from 'react';

export default function GeneralToolbar({ group }: { group: string }) {
  const registry = toolbarRegistry.toolbar(group)

  return (
    <Stack sx={wrapperSx} divider={<Divider orientation="vertical" flexItem />} direction="row" id="header">
      <Box sx={{ display: 'flex', flex: 1, gap: 1, alignItems: 'center' }}>
        {registry
          .filter(x => x.toolbar?.some(g => g.side === 'left'))
          .sort((a, b) => (a.toolbar?.find(g => g.side === 'left')?.priority ?? 0) - (b.toolbar?.find(g => g.side === 'left')?.priority ?? 0))
          .map((item) => (
            <Fragment key={item.id}>
              {item.component && <item.component />}
            </Fragment>
          ))}
      </Box>
      <div>
        {registry
          .filter(x => x.toolbar?.some(g => g.side === 'right'))
          .sort((a, b) => (a.toolbar?.find(g => g.side === 'right')?.priority ?? 0) - (b.toolbar?.find(g => g.side === 'right')?.priority ?? 0))
          .map((item) => (
            <Fragment key={item.id}>
              {item.component && <item.component />}
            </Fragment>
          ))}
      </div>
    </Stack>
  )
}

const wrapperSx = {
  display: 'flex',
  borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
  px: 1,
  pt: 0.75,
  pb: 0.75,
  bgcolor: 'background.default',
}
