import AlbumPhotoThumbnailBackground from '@/components/AlbumPhotoThumbnailBackground';
import { useAlbumPhotoCardStoreSelector } from '@/context/albumPhotoCardStore';
import { useFavorites } from '@/context/favoritesStore';
import { useSelected_isSelected } from '@/context/selectedStore';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import AlbumPhotoRowItem from '@/drawers/rows/AlbumPhotoRowItem';
import { type GalleryPhoto } from '@/lib/galleryData';
import FavoriteToggle from '@/toggle/FavoriteToggle';
import SelectedToggle from '@/toggle/SelectedToggle';
import { Box, Typography, useTheme } from '@mui/material';
import { SeparatorHorizontal, SeparatorVertical } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';

interface AlbumPhotoCardProps {
  photo: GalleryPhoto
}

function stopPropagation(e: React.MouseEvent) {
  e.stopPropagation();
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

  const thumbWidth = Math.max(width / 2, 200);
  const thumbHeight = Math.max(height / 2, 150);

  const thumbnailStyle = useMemo(() => ({
    border:
        selectMode && isSelected
          ? `3px solid ${theme.palette.success.main}`
          : isPreviewed
            ? `4px solid ${theme.palette.primary.main}`
            : 'none',
    borderRadius: 8,
  }), [
    selectMode,
    isSelected,
    isPreviewed,
    theme.palette.success.main,
    theme.palette.primary.main
  ]);

  const HIDDEN = new Set([
    'city',
    'albumName',
    'takenAtTs',
    'batch',
    'imageUrl',
    'people',
    'social',
  ]);

  const properties = [
    {
      id: 'width',
      icon: <SeparatorVertical />,
      title: 'width',
      value: String(photo.width),
    },
    {
      id: 'height',
      icon: <SeparatorHorizontal />,
      title: 'height',
      value: String(photo.height),
    },
    {
      id: 'id',
      icon: null,
      title: 'id',
      value: String(photo.id),
    },
    {
      id: 'views',
      icon: null,
      title: 'views',
      value: String(photo.views),
    },
    {
      id: 'folder',
      icon: null,
      title: 'folder',
      value: String(photo.folder),
    },
    {
      id: 'title',
      icon: null,
      title: 'title',
      value: String(photo.title),
    },
    {
      id: 'likes',
      icon: null,
      title: 'likes',
      value: String(photo.likes),
    },
    {
      id: 'comments',
      icon: null,
      title: 'comments',
      value: String(photo.comments),
    },
    {
      id: 'takenAtTs',
      icon: null,
      title: 'taken at',
      value: String(photo.takenAt),
    },

  ];

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
        gap: 2,
        mb: 0.5,
        cursor: 'pointer',
        '&:hover': {
          filter: 'saturate(1.25)',
        },
      }}
    >
      <Box sx={{ width: `${thumbWidth}px`, height: `${thumbHeight}px`, flexShrink: 0, position: 'relative' }}>
        <AlbumPhotoThumbnailBackground
          imageUrl={photo.id}
          width={thumbWidth}
          height={thumbHeight}
          style={{...thumbnailStyle}}
        />
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '300px 300px 300px',
        gap: 2,
        overflow: 'hidden' }}>
        {Object.entries(photo)
          .filter(([key]) => !HIDDEN.has(key))
          .map(([key, value]) => (
            <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 0.25, py: 0.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} key={key}>
              <Typography variant="caption" color="textPrimary" sx={{ fontWeight: 'bold', width: 80, display: 'inline-block', textTransform: 'capitalize' }}>
                {key}
              </Typography>
              <Typography  variant="caption" color="textDisabled">
                {String(value)}
              </Typography>
            </Box>
          ))}
      </Box>

      <Box sx={{
        display: 'grid',
        gridTemplateColumns: '300px 300px 300px',
        gap: 2,
        overflow: 'hidden' }}>
        {properties.map((prop) => <AlbumPhotoRowItem key={prop.id} icon={prop.icon} title={prop.title} value={prop.value} />)}
      </Box>

      {selectMode && (
        <Box sx={{ position: 'absolute', top: 4, left: 4, zIndex: 2 }} onClick={stopPropagation}>
          <SelectedToggle photoId={photo.id} />
        </Box>
      )}

      {favorite && (
        <Box sx={{ position: 'absolute', top: 0, right: 0, zIndex: 2 }} onClick={stopPropagation}>
          <FavoriteToggle _photoId={photo.id} />
        </Box>
      )}

      <Box sx={{
        display: 'flex', gap: 0.5, flexWrap: 'wrap', flex: 1, p: 1
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

    </Box>
  );
}

export default memo(AlbumPhotoRow, (prev, next) => (
  prev.photo === next.photo
));
