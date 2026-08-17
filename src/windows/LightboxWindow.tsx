import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, Dialog, IconButton } from '@mui/material';
import { X } from 'lucide-react';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen)
  const { setSetting } = useSettings()

  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const photo = previewPhotoObj ?? null

  const showWindow = lightboxOpen === true

  if (!showWindow) {
    return null
  }

  return (
    <Dialog
      fullScreen
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, lightboxOpen: false }))}
      sx={{
        '& .MuiDialog-paper': {
          bgcolor: (theme) => theme.palette.divider + 'EE',
          backdropFilter: 'blur(14px)',
          filter: 'saturate(1.25)',
        },
      }}
    >
      <IconButton
        aria-label="Close image"
        onClick={() => setSetting(prev => ({ ...prev, lightboxOpen: false }))}
        sx={{
          position: 'absolute',
          top: 1,
          right: 1,
          zIndex: 1,
          color: 'common.white',
          bgcolor: 'rgba(0, 0, 0, 0.45)',
          '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.7)' },
        }}
      >
        <X size={24} />
      </IconButton>
      <Box
        onClick={() => setSetting(prev => ({ ...prev, lightboxOpen: false }))}
        component="img"
        src={composeUrl(photo, true)}
        alt={photo.title}
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Dialog>
  );
}
