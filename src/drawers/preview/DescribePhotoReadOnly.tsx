import { useDescriptions } from '@/context/descriptionsStore';
import { Typography } from '@mui/material';

export default function DescribePhotoReadOnly({ photoId }: { photoId: string }) {
  const { getDescription } = useDescriptions()

  return (
    <Typography variant="subtitle1" sx={{ p: 2 }}>
      {getDescription(photoId)}
    </Typography>
  )
}
