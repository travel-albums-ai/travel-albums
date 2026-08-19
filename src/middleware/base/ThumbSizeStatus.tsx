import { useAlbumPhotoCard, useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { Box, Slider, Tooltip } from '@mui/material';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const ASPECT_RATIO = 3 / 4; // height = width * 9/16

export default function ThumbSizeStatus() {
  const { setSetting } = useAlbumPhotoCard();
  const { width } = useAlbumPhotoCardStoreSelector((state) => state)
  const { t } = useTranslation()

  const handleWidthChange = (_: Event, value: number | number[]) => {
    const width = value as number;
    const height = Math.round(width * ASPECT_RATIO);

    setSetting((prev) => ({ ...prev, width, height }));
  };

  return <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }} id="zoom-controls">
    <ZoomOut size={16} style={{ opacity: 0.6 }} />
    <Tooltip title={t('adjustThumbnailSize', { width })} placement="top" arrow>
      <Slider
        sx={{
          width: 200, height: 8, p: 0,
          '& .MuiSlider-thumb': {
            width: 16,
            height: 16,
            '::after': {
              height: 4
            },
          },

        }}
        size="small"
        value={width}
        onChange={handleWidthChange}
        min={200}
        max={500}
        step={50}
      />
    </Tooltip>
    <ZoomIn size={16} style={{ opacity: 0.6 }} />
  </Box>
}
