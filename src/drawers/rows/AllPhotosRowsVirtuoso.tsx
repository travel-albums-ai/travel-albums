import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import AlbumPhotoRow from '@/drawers/rows/AlbumPhotoRow';
import { GalleryPhoto } from '@/lib/galleryData';

type Props = {
  photos: GalleryPhoto[];
};

const GRID_STYLE = { height: '100%', overflowX: 'visible' } as const;

const SimpleList = ({ style, children, ...props }: any) => (
  <Box
    {...props}
    style={style}
    sx={{
      display: 'flex',
      flexDirection: 'column',
      py: 1,
    }}
  >
    {children}
  </Box>
);

export default function AllPhotosRowsVirtuoso({ photos }: Props) {
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const gap = useAlbumPhotoCardStoreSelector((state) => state.gap);
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)
  const rangeRef = useRef({ startIndex: 0, endIndex: 0 });

  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    if (!previewPhotoObj) return;

    const index = photosRef.current.findIndex(
      p => p.id === previewPhotoObj.id
    );

    if (index < 0) return;

    const el = document.querySelector(
      `[data-photo-id="${previewPhotoObj.id}"]`
    ) as HTMLElement | null;

    if (!el) {
      virtuosoRef.current?.scrollToIndex({
        index,
        align: 'center',
        behavior: 'auto',
      });
      return;
    }

    const rect = el.getBoundingClientRect();

    const scroller = el.closest('[data-virtuoso-scroller]') as HTMLElement;
    const viewport = scroller.getBoundingClientRect();

    const margin = 100;

    const comfortablyVisible =
    rect.top >= viewport.top + margin &&
    rect.bottom <= viewport.bottom - margin;

    if (!comfortablyVisible) {
      virtuosoRef.current?.scrollToIndex({
        index,
        align: 'center',
        behavior: 'auto',
      });
    }
  }, [previewPhotoObj]);

  const itemContent = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (!photo) return null;

      return (
        <div data-photo-id={photo.id}>
          <AlbumPhotoRow photo={photo} />
        </div>
      );
    },
    [photos]
  );

  const List = useMemo(() => {
    const Comp = (props: any) => (
      <SimpleList {...props} width={width} gap={gap} />
    );
    Comp.displayName = 'VirtuosoGridList';
    return Comp;
  }, [width, gap]);

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      rangeChanged={(range) => {
        rangeRef.current = range;
      }}
      increaseViewportBy={{ top: height * 5, bottom: height * 5 }}
      style={GRID_STYLE}
      totalCount={photos.length}
      computeItemKey={(index) => photos[index]?.id ?? index}
      components={{ List }}
      itemContent={itemContent}
    />
  );
}
