import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import ControlButton from './LightboxControls';
import LightboxFilmstrip from './LightboxFilmstrip';
import LightboxViewer from './LightboxViewer';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSections_GLOBAL } from '@/context/globals/sectionsStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { composeUrl } from '@/lib/thumbnailService';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const previewPhotoObj = useSettingsStoreSelector(s => s.previewPhotoObj);

  const width = useAlbumPhotoCardStoreSelector(state => state.width);
  const height = useAlbumPhotoCardStoreSelector(state => state.height);

  const { setPreviewPhotoObj, setSetting } = useSettings();

  const { type_name = '', id = '' } = useParams();

  const sections = useSections_GLOBAL();
  const photosFiltered = useFilteredPhotos_GLOBAL();

  const showAll = type_name === '';

  const foundSection = sections?.find(s => s.type === type_name);

  const foundSet = foundSection?.data?.find((d: any) => d.name === id);

  const photos = showAll ? photosFiltered : foundSet?.photos || [];

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

    const index = photos.findIndex(p => p.id === previewPhotoObj.id);

    return index >= 0 ? index : 0;
  }, [photos, previewPhotoObj]);

  useEffect(() => {
    if (showWindow) {
      setCurrentIndex(initialIndex);
    }
  }, [showWindow, initialIndex]);

  const currentPhoto = photos[currentIndex];

  const goTo = useCallback((index: number) => {
    if (index < 0 || index >= photos.length) return;
    setCurrentIndex(index);
    const photo = photos[index];
    if (photo) setPreviewPhotoObj(photo);
  }, [photos, setPreviewPhotoObj]);

  const previous = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.max(0, index - 1);
      const photo = photos[nextIndex];
      if (photo) setPreviewPhotoObj(photo);
      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  const next = useCallback(() => {
    setCurrentIndex(index => {
      const nextIndex = Math.min(photos.length - 1, index + 1);
      const photo = photos[nextIndex];
      if (photo) setPreviewPhotoObj(photo);
      return nextIndex;
    });
  }, [photos, setPreviewPhotoObj]);

  useEffect(() => {
    if (!showWindow) return;

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
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWindow, previous, next, close]);

  useEffect(() => {
    if (!showWindow) return;

    const start = Math.max(0, currentIndex - 5);
    const end = Math.min(photos.length - 1, currentIndex + 5);

    for (let index = start; index <= end; index++) {
      const photo = photos[index];
      if (!photo) continue;
      const image = new Image();
      image.src = composeUrl(photo, true);
    }
  }, [showWindow, currentIndex, photos]);

  if (!showWindow || !currentPhoto) return null;

  return (
    <>
      {/* // <Dialog fullWidth fullScreen open={showWindow} onClose={close} slotProps={{ paper: { sx: { width: '90vw', height: '90vh', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' } } }}> */}
      <Box sx={{ flex: 1, minHeight: 0, minWidth: 0, display: 'flex', borderRadius: 2, gap: 2, alignItems: 'center' }}>
        <ControlButton tooltip="Previous photo" onClick={() => previous()} icon={<ChevronLeft size={20} />} disabled={currentIndex === 0} />

        <LightboxViewer photo={currentPhoto} />

        <ControlButton tooltip="Next photo" onClick={() => next()} icon={<ChevronRight size={20} />} disabled={currentIndex === photos.length - 1} />
      </Box>

      <Box sx={{ flex: '0 0 auto', px: { xs: 1, md: 3 }, pt: 1, pb: { xs: 1, md: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, overflow: 'hidden', minHeight: Math.max(56, Math.min(90, height / 7)) + 12 }}>
          <LightboxFilmstrip photos={photos} currentIndex={currentIndex} goTo={goTo} width={width} height={height} />
        </Box>
      </Box>
      {/* </Dialog> */}
    </>
  );
}
