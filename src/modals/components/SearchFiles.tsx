import AlbumPhotoThumbnailBackground from '@/components/AlbumPhotoThumbnailBackground';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useSettings } from '@/context/settingsStore';
import ElementLabels from '@/drawers/components/ElementLabels';
import CustomPopoverForTrigger from '@/modals/components/CustomPopoverForTrigger';
import {
  Box,
  TextField,
  Typography
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SearchFiles() {
  const [searchTerm, setSearchTerm] = useState('');
  const { setPreviewPhotoObj } = useSettings()
  const photos = useFilteredPhotos_GLOBAL();
  const { t } = useTranslation();

  const photosRelevant = photos?.filter(photo => {
    const filenameMatch = photo.id.toLowerCase().includes(searchTerm.toLowerCase());
    const descriptionMatch = photo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return filenameMatch || descriptionMatch;
  }).filter((_, index) => index < 100) || []

  return (<>
    <CustomPopoverForTrigger
      preOpen={true}
      trigger={<TextField
        fullWidth
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={t('searchFilesPlaceholder')}
        variant="standard"
      />}>

      <ElementLabels />

      {photosRelevant.length > 0 && photosRelevant
        .map(photo => (
          <Box key={photo.id} onClick={() => {
            setPreviewPhotoObj(photo)
          }} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>

            <Box sx={{ width: 32, height: 32, overflow: 'hidden', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }} >
              <AlbumPhotoThumbnailBackground imageUrl={photo.id}  />
            </Box>

            <Typography variant="subtitle2" color="textSecondary">{photo.id}</Typography>
            <Typography variant="caption" color="textDisabled" align="right" sx={{ flex: 1 }}>{photo.imageUrl}</Typography>
          </Box>
        ))}

      {photosRelevant.length === 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
          <Typography variant="subtitle2" color="textSecondary">{t('noPhotosFound')}</Typography>
        </Box>
      )}

    </CustomPopoverForTrigger>
  </>)
}
