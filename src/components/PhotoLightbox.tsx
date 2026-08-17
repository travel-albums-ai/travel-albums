import { type GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, Dialog, IconButton } from '@mui/material';
import { X } from 'lucide-react';

interface PhotoLightboxProps {
  photo: GalleryPhoto;
  open: boolean;
  onClose: () => void;
}

export default function PhotoLightbox({ photo, open, onClose }: PhotoLightboxProps) {
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
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
        onClick={onClose}
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
        onClick={onClose}
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
