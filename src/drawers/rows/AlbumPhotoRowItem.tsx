import { type GalleryPhoto } from '@/lib/galleryData';
import { Box, Typography } from '@mui/material';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
}

export default function AlbumPhotoRowItem({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {


  return (

    <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 0.25, py: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
      {icon}
      <Typography variant="caption" color="textPrimary" sx={{ fontWeight: 'bold', width: 80, display: 'inline-block', textTransform: 'capitalize' }}>
        {title}
      </Typography>
      <Typography  variant="caption" color="textDisabled">
        {String(value)}
      </Typography>
    </Box>

  );
}
