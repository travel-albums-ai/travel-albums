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

const GRID_STYLE = {
  height: '100%',
  overflowX: 'visible',
} as const;

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
  const width = useAlbumPhotoCardStoreSelector((s) => s.width);
  const height = useAlbumPhotoCardStoreSelector((s) => s.height);
  const gap = useAlbumPhotoCardStoreSelector((s) => s.gap);
  const previewPhotoObj = useSettingsStoreSelector((s) => s.previewPhotoObj);
  const raf = useRef<number | null>(null);
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);

  const photoIndex = useMemo(() => {
    const map = new Map<string, number>();

    photos.forEach((photo, index) => {
      map.set(photo.id, index);
    });

    return map;
  }, [photos]);

  useEffect(() => {
    if (!previewPhotoObj) return;

    if (raf.current) {
      cancelAnimationFrame(raf.current);
    }

    raf.current = requestAnimationFrame(() => {
      const index = photoIndex.get(previewPhotoObj.id);

      if (index == null) return;

      const element = document.querySelector(
        `[data-photo-id="${previewPhotoObj.id}"]`
      ) as HTMLElement | null;

      if (element) {
        element.scrollIntoView({
          block: 'nearest',
          inline: 'nearest',
          behavior: 'smooth',
        });
        return;
      }

      virtuosoRef.current?.scrollToIndex({
        index,
        align: 'center',
        behavior: 'smooth',
      });
    });

    return () => {
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [previewPhotoObj, photoIndex]);

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
    const Component = (props: any) => (
      <SimpleList {...props} width={width} gap={gap} />
    );

    Component.displayName = 'VirtuosoGridList';

    return Component;
  }, [width, gap]);

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      style={GRID_STYLE}
      totalCount={photos.length}
      computeItemKey={(index) => photos[index]?.id ?? index}
      increaseViewportBy={{
        top: height * 5,
        bottom: height * 5,
      }}
      components={{ List }}
      itemContent={itemContent}
    />
  );
}
