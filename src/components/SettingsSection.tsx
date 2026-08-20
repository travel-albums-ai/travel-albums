import { Box, Divider, Stack, Typography } from '@mui/material';
import { cloneElement } from 'react';

export default function SettingsSection({ title, icon, guidance, children, gap = 0.5, divider = true } : { title?: string, icon?: React.ReactNode, guidance?: string, children: React.ReactNode, gap?: number, divider?: boolean }) {

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'auto' }}>
    <Box sx={{
      bgcolor: theme => theme.palette.background.paper + 'BD',
      mb: 1,
      border: '1px solid',
      borderColor: 'divider',
      p: 1,
      borderRadius: 2
    }}
    >
      {(title || icon) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, mb: 1, px: 0.5 }}>
        {icon && cloneElement(icon as React.ReactElement<{ size: number }>, { size: 16 })}
        <Typography variant="subtitle2" sx={{ lineHeight: 1 }} color="textPrimary">{title}</Typography>
        {guidance && <Typography variant="caption" sx={{ flex: 1, textAlign: 'right' }} color="textSecondary">{guidance}</Typography>}
      </Box>}
      <Stack sx={{ gap, px: 0.5 }} divider={divider ? <Divider /> : undefined}>
        {children}
      </Stack>
    </Box>
  </Box>
}
