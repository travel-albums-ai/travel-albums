import useTransform_Photo2Exif from '@/hooks/useTransform_Photo2Exif';
import { GalleryPhoto } from '@/lib/galleryData';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, Divider, Skeleton, Stack, Tooltip, Typography } from '@mui/material';
import { Aperture, Camera, Focus, Rabbit, SquareFunction, Timer } from 'lucide-react';

export default function PhotoExifDetails({ photo }: { photo?: GalleryPhoto }) {
  const { exif } = useTransform_Photo2Exif(composeUrl(photo))

  // if (!photo) {
  //   return null
  // }

  const items = [
    {
      key: 'FNumber',
      value: exif?.FNumber ? `ƒ/${exif.FNumber}` : null,
      icon: <SquareFunction size={20} />
    },
    {
      key: 'ExposureTime',
      value: exif?.ExposureTime ? `${Math.round(exif.ExposureTime * 1000 * 1000) / 1000 }ms` : null,
      icon: <Timer size={20} />
    },
    {
      key: 'ISOSpeedRatings',
      value: exif?.ISO ? `ISO ${exif.ISO}` : null,
      icon: <Rabbit size={20} />
    },
    {
      key: 'FocalLength',
      value: exif?.FocalLength ? `${exif.FocalLength}mm` : null,
      icon: <Focus size={20} />
    },
    {
      key: 'Model',
      value: exif?.Model || null,
      icon: <Camera size={20} />
    },
    {
      key: 'ApertureValue',
      value: exif?.ApertureValue ? `Av ${exif.ApertureValue}` : null,
      icon: <Aperture size={20} />
    }
  ]

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={1}
    >
      {items
        .map(item => (
          <Tooltip title={item.key + ": " + (item.value ?? '')} arrow key={item.key}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, alignItems: 'center', width: '60px' }}>
              <Box sx={{ opacity: 0.7, color: 'text.disabled' }}>
                { item.icon }
              </Box>
              {item.value && <Typography variant="caption" sx={{ width: '65px', fontSize: '11px' }} align="center" noWrap color="textSecondary" >{item.value || '0'}</Typography>}
              {!item.value && <Skeleton variant="text" width={40} height={20} />}
            </Box>
          </Tooltip>
        ))}
    </Stack>
  )
}
