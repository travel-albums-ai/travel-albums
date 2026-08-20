import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';

type ViewerProps = {
  photo: any;
};

export default function LightboxBackground({ photo }: ViewerProps) {
  if (!photo) return null;

  return (
    <Box sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      width: '100%',
      height: '100%',
      opacity: 0.25,
      filter: 'blur(12px) saturate(1.75)',
      borderRadius: 16,
      overflow: 'hidden',
      zIndex: 0,
    }} >
      <AlbumPhotoThumbnailBackgroundNg
        photo={photo}
        original={true}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
}
