import { Box, Stack, Typography } from '@mui/material';
import { cloneElement } from 'react';

export default function SettingsSection({ title, icon, guidance, children, gap = 0.5, divider = true } : { title?: string, icon?: React.ReactNode, guidance?: string, children: React.ReactNode, gap?: number, divider?: boolean }) {

  return <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, flexGrow: 1, overflow: 'auto' }}>
    {(title || icon) && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1 }}>
      {icon && cloneElement(icon, { size: 16 })}
      <Typography variant="subtitle2" sx={{ lineHeight: 1 }} color="textPrimary">{title}</Typography>
      {guidance && <Typography variant="caption" sx={{ flex: 1, textAlign: 'right' }} color="textSecondary">{guidance}</Typography>}
    </Box>}
    <Stack sx={{ gap, mb: 1, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', p: 2, borderRadius: 2 }} divider={divider ? <Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} /> : undefined}>
      {children}
    </Stack>
  </Box>
}
