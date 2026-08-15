import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import AlbumsMetaDetails from '@/components/AlbumsMetaDetails';
import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import DescribePhotoReadOnly from '@/drawers/preview/DescribePhotoReadOnly';
import { type GalleryPhoto } from '@/lib/galleryData';
import { Box, Card, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
  style?: React.CSSProperties
  original?: boolean
}

function prettyTime(dateInput: string) {
  const d = dayjs(dateInput);
  const hour = d.hour();

  let partOfDay = '';

  if (hour >= 5 && hour < 12) {
    partOfDay = 'Morning';
  } else if (hour < 18) {
    partOfDay = 'Afternoon';
  } else if (hour < 22) {
    partOfDay = 'Evening';
  } else {
    partOfDay = 'Night';
  }

  return `${partOfDay}, ${d.format('D MMM YYYY')}`;
}

export default function AlbumPhotoCard({
  photo,
  style,
  original = false,
}: AlbumPhotoCardProps) {
  const theme = useTheme();

  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const showPersistentDetails = useAlbumPhotoCardStoreSelector((state) => state.showPersistentDetails);
  const isPreviewed = useSettingsStoreSelector((state) => state.previewPhotoObj?.id === photo.id);
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const photoTagIds = useTagsStoreSelector((state) => state.taggedPhotos.find((tp) => tp.id === photo.id)?.tags);

  const { setPreviewPhotoObj, setFocusedPhoto } = useSettings();
  const { isFavorite } = useFavorites();

  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const tags = useTagsStoreSelector((state) => state.tags);

  const resolvedTags = useMemo(() => {
    if (!photoTagIds?.length) return [];

    return photoTagIds
      .map((tagId) => tags.find((tag) => tag.id === tagId))
      .filter((tag): tag is NonNullable<typeof tag> => Boolean(tag));
  }, [photoTagIds, tags]);

  const hasGps =
    Number.isFinite(photo.latitude) &&
    Number.isFinite(photo.longitude) &&
    photo.latitude !== 0 &&
    photo.longitude !== 0;

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (hasGps && e.shiftKey) {
        setFocusedPhoto(photo.id);
      }
    },
    [hasGps, photo.id, setFocusedPhoto]
  );

  const handleClick = useCallback(() => {
    setPreviewPhotoObj(photo);
  }, [photo, setPreviewPhotoObj]);

  const showDetails = showPersistentDetails && width >= 150;

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      component="article"
      sx={{
        position: 'relative',
        display: 'flex',
        minHeight: `${height}px`,
        height: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        cursor: 'pointer',
        transition: 'filter 0.25s',

        '&:hover': {
          filter: 'saturate(1.25)',

          // Hide the read-only description while hovering.
          '& .album-photo-description': {
            opacity: 0,
            pointerEvents: 'none',
          },

          // Move tags upward while hovering.
          '& .album-photo-tags': {
            bottom: 56,
          },

          // Show details while hovering.
          '& .album-photo-details': {
            opacity: 1,
            pointerEvents: 'auto',
          },
        },

        // Details are hidden unless persistent details are enabled.
        '& .album-photo-details': {
          opacity: showDetails ? 0 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.15s',
        },

        // Description is normally visible.
        '& .album-photo-description': {
          opacity: 1,
          transition: 'opacity 0.15s',
        },

        ...style,
      }}
    >
      <AlbumPhotoThumbnailBackgroundNg
        photo={photo}
        width={photo.width}
        original={original}
        height={height}
        style={{
          border:
            selectMode && isSelected
              ? `3px solid ${theme.palette.success.main}`
              : isPreviewed
                ? `4px solid ${theme.palette.primary.main}`
                : 'none',
          borderRadius: 8,
        }}
      />

      <Box
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          left: 4,
          height: '40px',
          zIndex: 2,
        }}
      >
        <GeneralRegistryToolbar
          group="album-photo-card"
          context={{
            photoId: photo.id,
            favorite,
            selectMode,
          }}
        />
      </Box>

      <Box
        className="album-photo-description"
        sx={{
          position: 'absolute',
          bottom: 0,
          right: 16,
          left: 16,
          zIndex: 2,
        }}
      >
        <DescribePhotoReadOnly photoId={photo.id} />
      </Box>

      {resolvedTags.length > 0 && (
        <Box
          className="album-photo-tags"
          sx={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            zIndex: 2,
            display: 'flex',
            gap: 0.5,
            flexWrap: 'wrap',
            maxWidth: '70%',
            transition: 'bottom 0.15s',
          }}
        >
          {resolvedTags.map((tag) => (
            <Box
              key={tag.id}
              sx={{
                backgroundColor: `${tag.color}BD`,
                color: '#fff',
                px: 1,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.625rem',
                fontWeight: 500,
              }}
            >
              {tag.name}
            </Box>
          ))}
        </Box>
      )}

      {width >= 150 && (
        <Box
          className="album-photo-details"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            borderRadius: 2,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            gap: 0.5,
            border: (theme) =>
              `1px dashed ${theme.palette.divider}42`,
            bgcolor: (theme) =>
              `${theme.palette.background.paper}AA`,
            zIndex: 3,
            px: 2,
            py: 0.75,

            ...(showDetails && {
              opacity: 1,
              pointerEvents: 'auto',
            }),
          }}
        >
          {width >= 250 && (
            <Tooltip arrow title={photo.takenAt}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  opacity: 0.9,
                  fontWeight: 500,
                  flexGrow: 1,
                }}
              >
                {prettyTime(photo.takenAt)}
              </Typography>
            </Tooltip>
          )}

          <AlbumsMetaDetails
            photos={[photo]}
            minWidth={7}
            filterEmpty
          />
        </Box>
      )}
    </Card>
  );
}
