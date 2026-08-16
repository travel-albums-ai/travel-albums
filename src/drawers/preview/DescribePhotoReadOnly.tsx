import { useDescriptions } from '@/context/descriptionsStore';
import { Box, Typography } from '@mui/material';

export default function DescribePhotoReadOnly({ photoId }: { photoId: string }) {
  const { getDescription } = useDescriptions()

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="caption" color="textSecondary" align="center">
        {getDescription(photoId)}
      </Typography>
    </Box>
  )
}
