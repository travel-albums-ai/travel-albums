import AlbumPhotoCardTags from '@/components/albumPhotoCard/AlbumPhotoCardTags';
import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import DescribePhotoReadOnly from '@/drawers/preview/DescribePhotoReadOnly';
import { type GalleryPhoto } from '@/lib/galleryData';
import { Box, Card, Divider, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import { type Theme } from '@mui/material/styles';
import dayjs from 'dayjs';
import {
  memo,
  useCallback,
  useMemo,
  type CSSProperties,
  type MouseEvent,
} from 'react';
import { useInView } from 'react-intersection-observer';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto;
  style?: CSSProperties;
  original?: boolean;
}

function prettyTime(dateInput: string) {
  const d = dayjs(dateInput);
  const hour = d.hour();

  const partOfDay =
    hour >= 5 && hour < 12
      ? 'Morning'
      : hour < 18
        ? 'Afternoon'
        : hour < 22
          ? 'Evening'
          : 'Night';

  return `${partOfDay}, ${d.format('D MMM YYYY')}`;
}

const cardSx = {
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  // height: '100%',
  overflow: 'hidden',
  borderRadius: 2,
  cursor: 'pointer',
  transition: 'filter 0.25s',

  '&:hover': {
    filter: 'saturate(1.25)',

    '& .album-photo-description': {
      opacity: 0,
      pointerEvents: 'none',
    },

    '& .album-photo-details': {
      opacity: 1,
      pointerEvents: 'auto',
    },
  },

  '& .album-photo-description': {
    opacity: 1,
    transition: 'opacity 0.15s',
  },

  '& .album-photo-details': {
    transition: 'opacity 0.15s',
  },
} as const;

const toolbarSx = {
  position: 'absolute',
  top: 4,
  left: 4,
  height: 40,
  zIndex: 2,
} as const;

const detailsSx = {
  position: 'absolute',
  right: 8,
  bottom: 8,
  left: 8,
  borderRadius: 2,
  justifyContent: "flex-start",
  alignItems: "center",
  gap: 1,
  zIndex: 3,
  px: 2,
  py: 0.75,
  bgcolor: (theme: Theme) => `${theme.palette.background.paper}BB`,
} as const;

function AlbumPhotoCard({
  photo,
  style,
  original = false,
}: AlbumPhotoCardProps) {
  const theme = useTheme();
  const { hasDescription } = useDescriptions()
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const showDescription = useAlbumPhotoCardStoreSelector((state) => state.showDescription);
  const showTags = useAlbumPhotoCardStoreSelector((state) => state.showTags);
  const showDate = useAlbumPhotoCardStoreSelector((state) => state.showDate);
  const showLocation = useAlbumPhotoCardStoreSelector((state) => state.showLocation);
  const showFileName = useAlbumPhotoCardStoreSelector((state) => state.showFileName);
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);

  const { ref, inView } = useInView({
  });

  const isPreviewed = useSettingsStoreSelector(
    (state) => state.previewPhotoObj?.id === photo.id,
  );

  const { setPreviewPhotoObj, setFocusedPhoto } = useSettings();
  const { isFavorite } = useFavorites();

  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const hasGps =
    Number.isFinite(photo.latitude) &&
    Number.isFinite(photo.longitude) &&
    photo.latitude !== 0 &&
    photo.longitude !== 0;

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (hasGps && event.shiftKey) {
        setFocusedPhoto(photo.id);
      }
    },
    [hasGps, photo.id, setFocusedPhoto],
  );

  const handleClick = useCallback(() => {
    setPreviewPhotoObj(photo);
  }, [photo, setPreviewPhotoObj]);

  const thumbnailBorder = useMemo(() => {
    if (selectMode && isSelected) {
      return `3px solid ${theme.palette.success.main}`;
    }

    if (isPreviewed) {
      return `4px solid ${theme.palette.primary.main}`;
    }

    return 'none';
  }, [
    isPreviewed,
    isSelected,
    selectMode,
    theme.palette.primary.main,
    theme.palette.success.main,
  ]);

  return (
    <>
      <Card
        ref={ref}
        component="article"
        onMouseEnter={handleMouseEnter}
        onClick={handleClick}
        sx={{
          ...cardSx,
          minHeight: height,
          borderBottomLeftRadius: showFileName ? 0 : 8,
          borderBottomRightRadius: showFileName ? 0 : 8,
          ...style,

          '& .album-photo-details': {
            ...cardSx['& .album-photo-details'],
            opacity: 0,
            pointerEvents: 'none',
          },
          '&:hover .album-photo-details': {
            opacity: 1,
            pointerEvents: 'auto',
          },
        }}
      >
        {inView && <>
          <AlbumPhotoThumbnailBackgroundNg
            photo={photo}
            width={photo.width}
            height={height}
            original={original}
            style={{
              border: thumbnailBorder,
              borderRadius: 8,
            }}
          />

          {(selectMode || favorite) && (
            <GeneralRegistryToolbar
              fullWidth={false}
              group="album-photo-card"
              sx={toolbarSx}
              context={{
                photoId: photo.id,
                favorite,
                selectMode,
              }}
            />
          )}

          {showTags && <AlbumPhotoCardTags photo={photo} />}

          {showDescription && hasDescription(photo.id) && (
            <DescribePhotoReadOnly photoId={photo.id} className="album-photo-description" sx={detailsSx} />
          )}

          <Stack direction="row" divider={<Divider orientation="vertical" sx={{ borderStyle: 'dotted' }} flexItem />} className="album-photo-details" sx={detailsSx}>
            {showDate && (
              <Tooltip arrow title={photo.takenAt}>
                <Typography
                  variant="caption"
                  gutterBottom={false}
                  sx={{
                    color: 'text.secondary',
                    opacity: 0.9,
                    fontWeight: 500,
                    lineHeight: 1.5,
                  }}
                >
                  {prettyTime(photo.takenAt)}
                </Typography>
              </Tooltip>
            )}
            <AlbumsMetaDetails
              photos={[photo]}
              minWidth={0}
              filterEmpty
              showCount={false}
              showLocation={showLocation}
            />
          </Stack>
        </>}

      </Card>

      {inView && showFileName && <Box sx={{ display: 'block', p: 0.5, bgcolor: 'background.paper', borderRadius: 2, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
        <Tooltip title={`${photo.folder} / ${photo.title}`} arrow>
          <Typography variant="caption" color="textSecondary">{photo.title}</Typography>
        </Tooltip>
      </Box>}
    </>
  );
}

export default memo(AlbumPhotoCard, (previous, next) => {
  return (
    previous.photo === next.photo &&
    previous.original === next.original &&
    previous.style === next.style
  );
});
