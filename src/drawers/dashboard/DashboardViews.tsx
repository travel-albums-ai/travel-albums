import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import workerFilterByKey from '@/hooks/sections/workers/filterByKey.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Typography } from '@mui/material';
import { Eye } from 'lucide-react';

export default function DashboardViews() {
  const photos = useFilteredPhotos_GLOBAL();
  const sectionPhotos = workerFilterByKey(photos, 'views')

  return (
    <SettingsSection title="Views" icon={<Eye />} >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {sectionPhotos?.map((item) => (
          <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <Box sx={{ width: '100px', height: '100px', borderRadius: 50, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
              <AlbumPhotoThumbnailBackgroundNg photo={item.photos?.[0]} width={100} height={100} />
            </Box>
            <Typography variant="caption" color="textDisabled">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
