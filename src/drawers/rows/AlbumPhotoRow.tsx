import AlbumPhotoThumbnailBackground from '@/components/AlbumPhotoThumbnailBackground';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import { type GalleryPhoto } from '@/lib/galleryData';
import FavoriteToggle from '@/toggle/FavoriteToggle';
import SelectedToggle from '@/toggle/SelectedToggle';
import { Box, Divider, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { memo, useCallback, useMemo } from 'react';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
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

function AlbumPhotoRow({ photo }: AlbumPhotoCardProps) {
  const theme = useTheme();

  const width = useAlbumPhotoCardStoreSelector((state) => state.width);
  const height = useAlbumPhotoCardStoreSelector((state) => state.height);

  const isPreviewed = useSettingsStoreSelector((state) => state.previewPhotoObj?.id === photo.id);
  const selectMode = useSettingsStoreSelector((state) => state.selectMode);
  const { setPreviewPhotoObj } = useSettings();
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

  const handleClick = useCallback(() => {
    setPreviewPhotoObj(photo);
  }, [photo, setPreviewPhotoObj]);


  const formattedTime = useMemo(
    () => prettyTime(photo.takenAt),
    [photo.takenAt]
  );

  return (
    <Box
      onClick={handleClick}
      sx={{
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        transition: 'filter 0.25s',
        overflow: 'hidden',
        p: 0.75,
        pb: 1.25,
        mb: 0.5,
        cursor: 'pointer',
        '&:hover': {
          filter: 'saturate(1.25)',
        },
      }}
    >
      <Box sx={{ width: `${width / 2}px`, height: `${height / 2}px`, flexShrink: 0, position: 'relative' }}>
        <AlbumPhotoThumbnailBackground
          imageUrl={photo.id}
          width={width / 2}
          height={height / 2}
          style={{
            border: (selectMode && isSelected)
              ? `3px solid ${theme.palette.primary.main}`
              : isPreviewed
                ? `1px solid ${theme.palette.primary.main}AA`
                : 'none',
            borderRadius: 8,
          }}
        />
      </Box>

      {selectMode && (
        <Box sx={{ position: 'absolute', top: 4, left: 4, zIndex: 2 }} onClick={stopPropagation}>
          <SelectedToggle photoId={photo.id} />
        </Box>
      )}

      {favorite && (
        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }} onClick={stopPropagation}>
          <FavoriteToggle photoId={photo.id} />
        </Box>
      )}

      {resolvedTags.length > 0 && (
        <Box sx={{
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

      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1}>
        <Tooltip arrow title={photo.takenAt}>
          <Typography variant="caption" sx={{ color: 'text.secondary', opacity: 0.9, fontWeight: 500, lineHeight: 2 }}>
            {formattedTime}
          </Typography>
        </Tooltip>

        <Typography variant="caption" color="textDisabled" align="right" sx={{ flex: 1,  lineHeight: 2 }}>{photo.imageUrl}</Typography>
      </Stack>
    </Box>
  );
}

export default memo(AlbumPhotoRow, (prev, next) => (
  prev.photo === next.photo
));
