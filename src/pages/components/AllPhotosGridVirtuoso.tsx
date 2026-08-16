import { Box } from '@mui/material';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { VirtuosoGrid, VirtuosoGridHandle } from 'react-virtuoso';

import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import AlbumPhotoCard from '../../components/AlbumPhotoCard';

type Props = {
  photos: GalleryPhoto[];
};

const GRID_STYLE = { height: '100%', overflowX: 'visible' } as const;
const CARD_STYLE = { gridColumn: 'span 1', gridRow: 'span 1' } as const;

const GridList = ({ style, children, width, gap, ...props }: any) => {
  return (
    <Box
      {...props}
      style={style}
      sx={{
        display: 'grid',
        gridTemplateColumns: `repeat(auto-fill, minmax(${width}px, 1fr))`,
        gap,
        gridAutoFlow: 'dense',
        py: 1,
        alignContent: 'start',
      }}
    >
      {children}
    </Box>
  );
};

export default function AllPhotosGridVirtuoso({ photos }: Props) {
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const virtuosoRef = useRef<VirtuosoGridHandle>(null);
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  const photosRef = useRef(photos);
  photosRef.current = photos;

  useEffect(() => {
    if (!previewPhotoObj) return;
    const index = photosRef.current.findIndex((p) => p.id === previewPhotoObj.id);
    if (index >= 0) {
      virtuosoRef.current?.scrollToIndex({ index, align: 'center', behavior: 'auto' });
    }
  }, [previewPhotoObj]);


  const itemContent = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (!photo) return null;

      return (
        <AlbumPhotoCard
          photo={photo}
          style={CARD_STYLE}
        />
      );
    },
    [photos]
  );

  const List = useMemo(() => {
    const Comp = (props: any) => (
      <GridList {...props} width={width} gap={1} />
    );
    Comp.displayName = 'VirtuosoGridList';
    return Comp;
  }, [width]);

  return (
    <VirtuosoGrid
      ref={virtuosoRef}
      increaseViewportBy={{ top: height * 3, bottom: height * 3 }}
      style={GRID_STYLE}
      totalCount={photos.length}
      computeItemKey={(index) => photos[index]?.id ?? index}
      components={{ List }}
      itemContent={itemContent}
    />
  );
}
