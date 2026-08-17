import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import peopleAndPetsWorker from '@/hooks/sections/workers/peopleGrouping.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Typography } from '@mui/material';
import { PersonStanding } from 'lucide-react';

export default function DashboardFriends() {
  const photos = useFilteredPhotos_GLOBAL();
  const sectionPhotos = peopleAndPetsWorker(photos)

  return (
    <SettingsSection title="Friends" icon={<PersonStanding />} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
        gap: 2, flexWrap: 'wrap', height: '100%' }}>
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
