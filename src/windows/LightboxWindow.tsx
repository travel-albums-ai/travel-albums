import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Lightbox } from 'yet-another-react-lightbox';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import Slideshow from 'yet-another-react-lightbox/plugins/slideshow';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const previewPhotoObj = useSettingsStoreSelector(s => s.previewPhotoObj);

  const { setSetting, setPreviewPhotoObj } = useSettings();

  const { type_name = '', id = '' } = useParams();

  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const showAll = type_name === '';

  const foundSection = sections?.find((s) => s.type === type_name);
  const foundSet = foundSection?.data?.find((d: any) => d.name === id);

  const photos = showAll
    ? photosFiltered
    : foundSet?.photos || [];

  const showWindow = lightboxOpen === true;

  const initialIndex = useMemo(() => {
    if (!previewPhotoObj || photos.length === 0) {
      return 0;
    }

    return photos.findIndex(p => p === previewPhotoObj);
  }, [photos, previewPhotoObj]);

  const slides = useMemo(
    () =>
      photos.map(p => ({
        src: composeUrl(p, true),
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
      <Lightbox
        open={showWindow}
        close={() =>
          setSetting(prev => ({
            ...prev,
            lightboxOpen: false,
          }))
        }
        index={initialIndex >= 0 ? initialIndex : 0}
        slides={slides}
        carousel={{
          finite: true,
          preload: 10,
        }}
        plugins={[
          Fullscreen,
          Slideshow,
          Zoom,
        ]}
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
