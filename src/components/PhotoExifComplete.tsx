
import useTransform_Photo2Exif from '@/hooks/useTransform_Photo2Exif';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';

import {
  Alert,
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

const splitByCamelCaseAll = (str: string) => {
  return str
    .replace(/([A-Z]{2,4})(?=[A-Z][a-z])/g, '$1 ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2');
};

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
          p: 1,
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
                    gridColumn: '1 / -1',
                    gap: 1,
                    alignItems: 'flex-start',
                    justifyContent: 'flex-start',
                    px: 0.5,
                    pb: 0.5,
                    mb: 0.5,
                    borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Typography
                    variant="caption" color="textSecondary" sx={{ width: 150, flex: '0 0 auto', fontFamily: 'monospace' }}
                  >
                    {splitByCamelCaseAll(key)}
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
