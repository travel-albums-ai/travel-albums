import { useDescriptions } from '@/context/descriptionsStore';
import { Box, Typography } from '@mui/material';

export default function DescribePhotoReadOnly({ photoId }: { photoId: string }) {
  const { getDescription } = useDescriptions()

  const section = '0 0 10px rgba(0,0,0,0.75)'
  const times = 4
  const sectionFocused = '0 0 2px rgba(0,0,0,1)'
  const timesFocused = 3

  return (
    <Box sx={{ p: 1, display: 'flex', flexDirection: 'column', gap: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Typography
        variant="caption"
        color="textSecondary"
        align="center"
        sx={{
          textShadow: Array(times).fill(section).join(', ') + ', ' + Array(timesFocused).fill(sectionFocused).join(', '),
        }}
      >
        {getDescription(photoId)}
      </Typography>
    </Box>
  )
}
