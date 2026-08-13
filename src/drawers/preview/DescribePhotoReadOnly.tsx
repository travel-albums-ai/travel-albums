import { useDescriptions } from '@/context/descriptionsStore';
import { Box, Typography } from '@mui/material';

export default function DescribePhotoReadOnly({ photoId }: { photoId: string }) {
  const { getDescription } = useDescriptions()

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="caption" color="textSecondary">
        {getDescription(photoId)}
      </Typography>
    </Box>
  )
}
