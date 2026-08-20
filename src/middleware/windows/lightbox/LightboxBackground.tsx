import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

type ViewerProps = {
  photo: any;
};

export default function LightboxBackground({ photo }: ViewerProps) {
  const [displayPhoto, setDisplayPhoto] = useState(photo);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!photo || photo === displayPhoto) return;

    setVisible(false);

    const timeout = window.setTimeout(() => {
      setDisplayPhoto(photo);
      setVisible(true);
    }, 150);

    return () => window.clearTimeout(timeout);
  }, [photo, displayPhoto]);

  if (!displayPhoto) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        opacity: visible ? 0.25 : 0,
        filter: 'blur(12px) saturate(1.75)',
        borderRadius: 16,
        overflow: 'hidden',
        zIndex: 0,
        transition: 'opacity 300ms ease-in-out',
      }}
    >
      <AlbumPhotoThumbnailBackgroundNg
        key={displayPhoto.id ?? displayPhoto.path}
        photo={displayPhoto}
        original={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
