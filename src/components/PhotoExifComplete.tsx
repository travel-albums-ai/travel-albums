
import useTransform_Photo2Exif from '@/hooks/useTransform_Photo2Exif';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';

import {
  Alert,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';


export default function PhotoExifComplete({ photo }: { photo?: GalleryPhoto }) {
  const { exif, loading, error } = useTransform_Photo2Exif(composeUrl(photo));

  const ignoredKeys = [
    'YCbCrSubSampling', 'YCbCrPositioning', 'XResolution', 'YResolution', 'ResolutionUnit',
    'FNumber', 'ISO', "ExifVersion", "DateTimeOriginal", "ApertureValue", "FocalLength"]

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'stretch',
          overflow: 'auto',
        }}
      >
        {loading && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,

            }}
          >
            <CircularProgress size={18} />
            <Typography variant="body2">
              Reading EXIF...
            </Typography>
          </Box>
        )}

        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}

        {!!exif && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 1,
              p: 2,
              fontSize: 13,
            }}
          >
            {Object.entries(exif)
              .filter(([key]) => !ignoredKeys.includes(key))
              .map(([key, value]) => (
                <Box
                  key={key}
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 0.25,
                    spaning: '1 / -1',
                    p: 1,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="body2" sx={{ fontWeight: 'bold', width: 150, flexShrink: 0, color: 'textSecondary' }}
                  >
                    {key}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {typeof value === 'object'
                      ? JSON.stringify(value)
                      : String(value)}
                  </Typography>
                </Box>
              ))}
          </Box>
        )}
      </Box>
    </>
  )
}
