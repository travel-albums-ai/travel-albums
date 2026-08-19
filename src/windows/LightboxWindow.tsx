import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box, useTheme } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { Lightbox } from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import 'yet-another-react-lightbox/plugins/thumbnails.css';

export default function LightboxWindow() {
  const theme = useTheme()
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const previewPhotoObj = useSettingsStoreSelector(s => s.previewPhotoObj);
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);

  const { setSetting, setPreviewPhotoObj } = useSettings();

  const { type_name = '', id = '' } = useParams();

  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const showAll = type_name === '';

  const foundSection = sections?.find(
    s => s.type === type_name,
  );

  const foundSet = foundSection?.data?.find(
    (d: any) => d.name === id,
  );

  const photos = showAll
    ? photosFiltered
    : foundSet?.photos || [];

  const showWindow = lightboxOpen === true;

  const initialIndex = useMemo(() => {
    if (!previewPhotoObj) {
      return 0;
    }

    const index = photos.findIndex(
      p => p.id === previewPhotoObj.id,
    );

    return index >= 0 ? index : 0;
  }, [photos, previewPhotoObj]);

  const slides = useMemo(
    () =>
      photos.map(p => ({
        src: composeUrl(p, true),
        thumbnail: composeUrl(p, false),
      })),
    [photos],
  );

  if (!showWindow) {
    return null;
  }

  return (
    <Box
      sx={{
        zIndex: 1,
        position: 'relative',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }}
    >
      <style>{`
        .yarl__thumbnails_thumbnail_active {
          border: 3px solid ${theme.palette.primary.main} !important;
        }
      `}</style>
      <Lightbox
        open={showWindow}
        close={() =>
          setSetting(prev => ({
            ...prev,
            lightboxOpen: false,
          }))
        }
        index={initialIndex}
        slides={slides}
        carousel={{
          finite: true,
          preload: 2,
        }}
        plugins={[
          Fullscreen,
          Slideshow,
          Thumbnails,
          Zoom,
        ]}
        thumbnails={{
          position: 'bottom',
          width: width / 2,
          height: height / 2,
          border: 0,
          borderRadius: 8,
          padding: 0,
          gap: 16,
          imageFit: 'cover',
          vignette: true,
          showToggle: true,
        }}
        on={{
          view: ({ index }) => {
            const photo = photos[index];

            if (photo) {
              setPreviewPhotoObj(photo);
            }
          },
        }}
      />
    </Box>
  );
}
