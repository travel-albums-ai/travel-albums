import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useDescriptions } from '@/context/descriptionsStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import DescribePhotoReadOnly from '@/drawers/preview/DescribePhotoReadOnly';
import { type GalleryPhoto } from '@/lib/galleryData';
import { Box, Card, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import {
  memo,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
  type MouseEvent,
} from 'react';

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

/**
 * Static styles are kept outside the component.
 *
 * This avoids constructing the same large style objects for every
 * AlbumPhotoCard render.
 */
const cardSx = {
  position: 'relative',
  display: 'flex',
  height: '100%',
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

    // '& .album-photo-tags': {
    //   bottom: 56,
    // },

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

const tagsSx = {
  position: 'absolute',
  top: 8,
  right: 8,
  zIndex: 2,
  display: 'flex',
  gap: 0.5,
  flexWrap: 'wrap',
  maxWidth: '70%',
  transition: 'bottom 0.15s',
} as const;

const tagSx = {
  color: '#fff',
  px: 1,
  py: 0.5,
  borderRadius: 2,
  fontSize: '0.625rem',
  fontWeight: 500,
} as const;

const detailsSx = {
  position: 'absolute',
  right: 0,
  bottom: 0,
  left: 0,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 0.5,
  borderRadius: 2,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  zIndex: 3,
  px: 2,
  py: 0.75,
  bgcolor: theme => `${theme.palette.background.paper}BB`,
} as const;

function AlbumPhotoCard({
  photo,
  style,
  original = false,
}: AlbumPhotoCardProps) {
  const theme = useTheme();
  const { hasDescription } = useDescriptions()
  const [isHovered, setIsHovered] = useState(false);
  /*
   * These are the values that can affect this individual card.
   *
   * Keeping the selectors narrow is important with Zustand-style stores:
   * unrelated store changes should not cause every card to rerender.
   */
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const showDescription = useAlbumPhotoCardStoreSelector((state) => state.showDescription);
  const showTags = useAlbumPhotoCardStoreSelector((state) => state.showTags);
  const showDate = useAlbumPhotoCardStoreSelector((state) => state.showDate);
  const showLocation = useAlbumPhotoCardStoreSelector((state) => state.showLocation);

  const selectMode = useSettingsStoreSelector((state) => state.selectMode);

  const isPreviewed = useSettingsStoreSelector(
    (state) => state.previewPhotoObj?.id === photo.id,
  );

  const photoTagIds = useTagsStoreSelector(
    (state) =>
      state.taggedPhotos.find((tp) => tp.id === photo.id)?.tags ?? null,
  );

  const tags = useTagsStoreSelector((state) => state.tags);

  const { setPreviewPhotoObj, setFocusedPhoto } = useSettings();
  const { isFavorite } = useFavorites();

  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const tagsById = useMemo(() => {
    const map = new Map<string, (typeof tags)[number]>();

    for (const tag of tags) {
      map.set(tag.id, tag);
    }

    return map;
  }, [tags]);

  const resolvedTags = useMemo(() => {
    if (!photoTagIds?.length) {
      return [];
    }

    const result = [];

    for (const tagId of photoTagIds) {
      const tag = tagsById.get(tagId);

      if (tag) {
        result.push(tag);
      }
    }

    return result;
  }, [photoTagIds, tagsById]);

  const hasGps =
    Number.isFinite(photo.latitude) &&
    Number.isFinite(photo.longitude) &&
    photo.latitude !== 0 &&
    photo.longitude !== 0;

  const showDetails = width >= 150;
  const canShowDate = width >= 250;
  const canShowDetails = width >= 150;

  const formattedTime = useMemo(
    () => (canShowDate ? prettyTime(photo.takenAt) : ''),
    [canShowDate, photo.takenAt],
  );

  const handleMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (hasGps && event.shiftKey) {
        setFocusedPhoto(photo.id);
      }
      setIsHovered(true);
    },
    [hasGps, photo.id, setFocusedPhoto],
  );

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

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
    <Card
      component="article"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      sx={{
        ...cardSx,
        minHeight: height,
        ...style,

        '& .album-photo-details': {
          ...cardSx['& .album-photo-details'],
          opacity: showDetails ? 1 : 0,
          pointerEvents: showDetails ? 'auto' : 'none',
        },
      }}
    >
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

      {resolvedTags.length > 0 && (
        <Box
          className="album-photo-tags"
          sx={tagsSx}
        >
          {resolvedTags.map((tag) => (
            <Box
              key={tag.id}
              sx={{
                ...tagSx,
                backgroundColor: `${tag.color}BD`,
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>
      )}

      {showDescription && !isHovered && hasDescription(photo.id) && (
        <Box className="album-photo-description" sx={detailsSx}>
          <DescribePhotoReadOnly photoId={photo.id} />
        </Box>
      )}

      {isHovered && (
        <Box className="album-photo-details" sx={detailsSx}>
          {canShowDate && (
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
                {formattedTime}
              </Typography>
            </Tooltip>
          )}
          <AlbumsMetaDetails
            photos={[photo]}
            minWidth={0}
            filterEmpty
          />
        </Box>
      )}
    </Card>
  );
}

/*
 * The gallery can contain thousands of these.
 *
 * Prevent rerendering when the parent rerenders but this photo's
 * relevant props haven't changed.
 */
export default memo(AlbumPhotoCard, (previous, next) => {
  return (
    previous.photo === next.photo &&
    previous.original === next.original &&
    previous.style === next.style
  );
});
