import {
  Box,
  Dialog,
  IconButton,
  useTheme,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxWindowNg() {
  const theme = useTheme();

  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const previewPhotoObj = useSettingsStoreSelector(s => s.previewPhotoObj);

  const width = useAlbumPhotoCardStoreSelector(state => state.width);
  const height = useAlbumPhotoCardStoreSelector(state => state.height);

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

  const [currentIndex, setCurrentIndex] = useState(0);

  const showWindow = lightboxOpen === true;

  const close = useCallback(() => {
    setSetting(prev => ({
      ...prev,
      lightboxOpen: false,
    }));
  }, [setSetting]);

  const initialIndex = useMemo(() => {
    if (!previewPhotoObj || photos.length === 0) {
      return 0;
    }

    const index = photos.findIndex(
      p => p.id === previewPhotoObj.id,
    );

    return index >= 0 ? index : 0;
  }, [photos, previewPhotoObj]);

  /*
   * Sync the internal index whenever the lightbox is opened
   * on a different photo.
   */
  useEffect(() => {
    if (showWindow) {
      setCurrentIndex(initialIndex);
    }
  }, [showWindow, initialIndex]);

  const currentPhoto = photos[currentIndex];

  const previousPhotos = useMemo(
    () =>
      photos.slice(
        Math.max(0, currentIndex - 5),
        currentIndex,
      ),
    [photos, currentIndex],
  );

  const nextPhotos = useMemo(
    () =>
      photos.slice(
        currentIndex + 1,
        currentIndex + 6,
      ),
    [photos, currentIndex],
  );

  const goTo = useCallback(
    (index: number) => {
      if (index < 0 || index >= photos.length) {
        return;
      }

      setCurrentIndex(index);

      const photo = photos[index];

      if (photo) {
        setPreviewPhotoObj(photo);
      }
    },
    [photos, setPreviewPhotoObj],
  );

  const previous = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.max(0, index - 1);
      const photo = photos[nextIndex];

      if (photo) {
        setPreviewPhotoObj(photo);
      }

      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  const next = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.min(
        photos.length - 1,
        index + 1,
      );

      const photo = photos[nextIndex];

      if (photo) {
        setPreviewPhotoObj(photo);
      }

      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  /*
   * Keyboard navigation.
   */
  useEffect(() => {
    if (!showWindow) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          previous();
          break;

        case 'ArrowRight':
          event.preventDefault();
          next();
          break;

        case 'Escape':
          event.preventDefault();
          close();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showWindow, previous, next, close]);

  /*
   * Preload nearby full-resolution images.
   */
  useEffect(() => {
    if (!showWindow) {
      return;
    }

    const start = Math.max(0, currentIndex - 5);
    const end = Math.min(
      photos.length - 1,
      currentIndex + 5,
    );

    for (let index = start; index <= end; index++) {
      const photo = photos[index];

      if (!photo) {
        continue;
      }

      const image = new Image();
      image.src = composeUrl(photo, true);
    }
  }, [showWindow, currentIndex, photos]);

  if (!showWindow || !currentPhoto) {
    return null;
  }

  const currentSrc = composeUrl(currentPhoto, true);

  const thumbWidth = Math.max(
    72,
    Math.min(120, width / 9),
  );

  const thumbHeight = Math.max(
    56,
    Math.min(90, height / 7),
  );

  const renderThumbnail = (
    photo: (typeof photos)[number],
    index: number,
  ) => {
    const active = index === currentIndex;

    return (
      <Box
        key={photo.id}
        onClick={() => goTo(index)}
        sx={{
          flex: '0 0 auto',
          width: thumbWidth,
          height: thumbHeight,
          borderRadius: 1,
          overflow: 'hidden',
          cursor: 'pointer',

          border: active
            ? `3px solid ${theme.palette.primary.main}`
            : '2px solid transparent',

          opacity: active ? 1 : 0.65,

          transition:
            'opacity 120ms ease, border-color 120ms ease, transform 120ms ease',

          '&:hover': {
            opacity: 1,
            transform: 'scale(1.04)',
          },
        }}
      >
        <Box
          component="img"
          src={composeUrl(photo, false)}
          loading="lazy"
          draggable={false}
          sx={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
          }}
        />
      </Box>
    );
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={close}
      slotProps={{
        paper: {
          sx: {
            height: '90vh',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      {/* Main image area */}
      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          minWidth: 0,

          display: 'grid',
          gridTemplateColumns: {
            xs: '48px minmax(0, 1fr) 48px',
            md: '72px minmax(0, 1fr) 72px',
          },

          alignItems: 'center',

          px: {
            xs: 1,
            md: 2,
          },

          py: 2,

          bgcolor: 'background.default',
        }}
      >
        {/* Previous button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={previous}
            disabled={currentIndex === 0}
            aria-label="Previous photo"
            sx={{
              width: 52,
              height: 52,

              color: '#fff',
              bgcolor: 'rgba(0,0,0,.45)',

              '&:hover': {
                bgcolor: 'rgba(0,0,0,.7)',
              },

              '&.Mui-disabled': {
                color: 'rgba(255,255,255,.2)',
                bgcolor: 'rgba(0,0,0,.2)',
              },
            }}
          >
            <ChevronLeft size={32} />
          </IconButton>
        </Box>

        {/* Image */}
        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,

            height: '100%',

            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',

            overflow: 'hidden',
          }}
        >
          <Box
            component="img"
            src={currentSrc}
            draggable={false}
            sx={{
              display: 'block',

              maxWidth: '100%',
              maxHeight: '100%',

              width: 'auto',
              height: 'auto',

              objectFit: 'contain',

              userSelect: 'none',

              boxShadow:
                '0 12px 50px rgba(0,0,0,.5)',
            }}
          />
        </Box>

        {/* Next button */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <IconButton
            onClick={next}
            disabled={currentIndex === photos.length - 1}
            aria-label="Next photo"
            sx={{
              width: 52,
              height: 52,

              color: '#fff',
              bgcolor: 'rgba(0,0,0,.45)',

              '&:hover': {
                bgcolor: 'rgba(0,0,0,.7)',
              },

              '&.Mui-disabled': {
                color: 'rgba(255,255,255,.2)',
                bgcolor: 'rgba(0,0,0,.2)',
              },
            }}
          >
            <ChevronRight size={32} />
          </IconButton>
        </Box>
      </Box>

      {/* Filmstrip */}
      <Box
        sx={{
          flex: '0 0 auto',

          px: {
            xs: 1,
            md: 3,
          },

          pt: 1,
          pb: {
            xs: 1,
            md: 2,
          },

          // background:
          //   'linear-gradient(to top, rgba(0,0,0,.9), rgba(0,0,0,.65), transparent)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,

            overflow: 'hidden',

            minHeight: thumbHeight + 12,
          }}
        >
          {/* Previous 5 */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-end',

              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            {previousPhotos.map(photo => {
              const index = photos.findIndex(
                p => p.id === photo.id,
              );

              return renderThumbnail(photo, index);
            })}
          </Box>

          {/* Current */}
          <Box
            sx={{
              flex: '0 0 auto',
            }}
          >
            {renderThumbnail(
              currentPhoto,
              currentIndex,
            )}
          </Box>

          {/* Next 5 */}
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              alignItems: 'center',
              justifyContent: 'flex-start',

              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            {nextPhotos.map(photo => {
              const index = photos.findIndex(
                p => p.id === photo.id,
              );

              return renderThumbnail(photo, index);
            })}
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
