import LoadingBar from '@/components/LoadingBar';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import RegistryStatus from '@/layout/components/RegistryStatus';
import { Box, Theme } from '@mui/material';

export default function StatusBar() {
  const selectedPhotos = useSelectedStoreSelector(s => s.photos)

  return (
    <Box sx={wrapperSx} id="status-bar">
      <LoadingBar />

      <RegistryStatus group="status-bar-primary" side="left" context={{ selectedPhotos }} />
      <RegistryStatus group="status-bar-secondary" side="right" divider context={{ selectedPhotos }}  />
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
