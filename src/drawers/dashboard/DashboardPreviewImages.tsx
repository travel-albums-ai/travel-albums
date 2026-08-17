import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { GalleryPhoto } from '@/lib/galleryData';
import { Box } from '@mui/material';

export default function DashboardPreviewImages({ photos, size = 60, count = 5 } : { photos: GalleryPhoto[], size?: number, count?: number }) {
  return (

    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
      {photos
        .filter((_, index) => index < count) // Limit to first 3 photos
        .map((photo, index) => (
          <Box sx={{ boxShadow: 8, width: size, height: size / 0.75, borderRadius: 1, overflow: 'hidden', mr: -1 }} key={photo.id}>
            <AlbumPhotoThumbnailBackgroundNg key={photo.id} photo={photo} width={size} height={size / 0.75} />
          </Box>
        ))}
    </Box>
  );
}
