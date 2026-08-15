import LoadingBar from '@/components/LoadingBar';
import GeneralRegistryStatus from '@/components/registry/GeneralRegistryStatus';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { Box, Theme } from '@mui/material';

export default function StatusBar() {
  const selectedPhotos = useSelectedStoreSelector(s => s.photos)

  return (
    <Box
      id="status-bar"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 1.5,
        px: 1.25,
        py: 0.5,
        height: '30px',
        bgcolor: 'background.default',
        position: 'relative',
        borderTop: (theme: Theme) => `1px solid ${theme.palette.divider}`,
      }}
    >
      <LoadingBar />

      <GeneralRegistryStatus group="status-bar-primary" side="left" context={{ selectedPhotos }} />
      <GeneralRegistryStatus group="status-bar-secondary" side="right" divider context={{ selectedPhotos }}  />
    </Box>
  )
}
