import LoadingBar from '@/components/LoadingBar';
import RegistryToolGroup from '@/layout/components/RegistryToolGroup';
import { Box, Theme } from '@mui/material';

export default function StatusBar() {
  return (
    <Box sx={wrapperSx} id="status-bar">
      <LoadingBar />

      <RegistryToolGroup group="status-bar-primary" side="left" />
      <RegistryToolGroup group="status-bar-secondary" side="right" divider />
    </Box>
  )
}

const wrapperSx = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1.5,
  px: 1.25,
  py: 0.5,
  bgcolor: 'background.default',
  position: 'relative',
  borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
}
