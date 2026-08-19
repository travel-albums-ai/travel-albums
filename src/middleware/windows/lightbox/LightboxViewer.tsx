import AlbumPhotoCard from '@/components/AlbumPhotoCard';
import { Box } from '@mui/material';

type ViewerProps = {
  photo: any;
};

export default function LightboxViewer({ photo }: ViewerProps) {
  if (!photo) return null;

  return (
    <Box
      sx={{
        minWidth: 0,
        minHeight: 0,
        flex: 1,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}
    >
      <AlbumPhotoCard
        original={true}
        photo={photo}
        thumbnailSx={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
        mapWidth={300}
        mapHeight={300}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
}
