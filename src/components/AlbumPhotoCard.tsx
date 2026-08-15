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
import { memo, useCallback, useMemo, useState } from 'react';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
  style?: React.CSSProperties
  original?: boolean
}

function prettyTime(dateInput: string) {
  const d = dayjs(dateInput);
  const hour = d.hour();

  let partOfDay = 'Morning';
  if (hour >= 12 && hour < 18) partOfDay = 'Afternoon';
  else if (hour >= 18) partOfDay = 'Evening';
  else if (hour >= 22 || hour < 5) partOfDay = 'Night';

  return `${partOfDay}, ${d.format('D MMM YYYY')}`;
}

function AlbumPhotoCard({ photo, style, original = false }: AlbumPhotoCardProps) {
  const theme = useTheme();
  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);
  const borderRadius = useAlbumPhotoCardStoreSelector((state) => state.borderRadius);
  const showPersistentDetails = useAlbumPhotoCardStoreSelector((state) => state.showPersistentDetails);
  const isPreviewed = useSettingsStoreSelector((state) => state.previewPhotoObj?.id === photo.id);
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const { setPreviewPhotoObj, setFocusedPhoto } = useSettings();
  const { isFavorite } = useFavorites();
  const favorite = isFavorite(photo.id);
  const isSelected = useSelected_isSelected(photo.id);

  const photoTagIds = useTagsStoreSelector(
    (state) => state.taggedPhotos.find((tp) => tp.id === photo.id)?.tags
  );
  const tags = useTagsStoreSelector((state) => state.tags);

  const resolvedTags = useMemo(() => {
    if (!photoTagIds || photoTagIds.length === 0) return [];
    return photoTagIds
      .map((tagId) => tags.find((t) => t.id === tagId))
      .filter((t): t is NonNullable<typeof t> => Boolean(t));
  }, [photoTagIds, tags]);

  const hasGps = Number.isFinite(photo.latitude) && Number.isFinite(photo.longitude)
    && photo.latitude !== 0 && photo.longitude !== 0;

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLElement>) => {
    setIsHovered(true);
    if (hasGps && e.shiftKey === true) {
      setFocusedPhoto(photo.id);
    }
  }, [hasGps, photo.id, setFocusedPhoto]);

  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  const handleClick = useCallback(() => {
    setPreviewPhotoObj(photo);
  }, [photo, setPreviewPhotoObj]);

  const metaPhotos = useMemo(() => [photo], [photo]);

  const formattedTime = useMemo(
    () => prettyTime(photo.takenAt),
    [photo.takenAt]
  );

  return (
    <Card
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      component="article"
      sx={{
        position: 'relative',
        display: 'flex',
        transition: 'filter 0.25s',
        minHeight: `${height}px`,
        height: '100%',
        overflow: 'hidden',
        borderRadius: 2,
        cursor: 'pointer',
        '&:hover': {
          filter: 'saturate(1.25)',
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
          border: (selectMode && isSelected)
            ? `3px solid ${theme.palette.success.main}`
            : isPreviewed
              ? `4px solid ${theme.palette.primary.main}`
              : 'none',
          borderRadius: 8,
        }}
      />

      <Box sx={{ position: 'absolute', top: 0, right: 0, left: 0, height: '40px', zIndex: 2 }}>
        <GeneralRegistryToolbar group={'album-photo-card'} context={{ photoId: photo.id, favorite, selectMode }} />
      </Box>

      {!isHovered && <Box sx={{ position: 'absolute', bottom: 0, right: 0, left: 0, zIndex: 2 }}>
        <DescribePhotoReadOnly photoId={photo.id} />
      </Box>}

      {resolvedTags.length > 0 && (
        <Box sx={{
          position: 'absolute', bottom: isHovered ? 56 : 8, left: 8, zIndex: 2,
          display: 'flex', gap: 0.5, flexWrap: 'wrap', maxWidth: '70%',
        }}>
          {resolvedTags.map((tag) => (
            <Box key={tag.id} sx={{
              backgroundColor: `${tag.color}BD`, color: '#fff', px: 1, py: 0.5,
              borderRadius: 2, fontSize: '0.625rem', fontWeight: 500,
            }}>
              {tag.name}
            </Box>
          ))}
        </Box>
      )}

      {/* {isHovered && (
        <img style={PRELOAD_IMG_STYLE} src={imageUrl(`${photo.folder}/${photo.title}`, demoMode)} />
      )} */}

      {(isHovered || showPersistentDetails) && width >= 150 && (
        <Box sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end', position: 'absolute',
          bottom: 0, left: 0, right: 0,
          borderRadius: `${(borderRadius - 1) * 10}px`,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          gap: 0.5,
          border: (theme) => `1px dashed ${theme.palette.divider}42`,
          bgcolor: (theme) => `${theme.palette.background.paper}AA`,
          zIndex: 3, px: 2, py: 0.75,
        }}>
          {width >= 250 && (
            <Tooltip arrow title={photo.takenAt}>
              <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.9, fontWeight: 500, flexGrow: 1 }}>
                {formattedTime}
              </Typography>
            </Tooltip>
          )}

          <AlbumsMetaDetails photos={metaPhotos} minWidth={7} filterEmpty />
        </Box>
      )}
    </Card>
  );
}

export default memo(AlbumPhotoCard, (prev, next) => (
  prev.photo === next.photo && prev.style === next.style
));
