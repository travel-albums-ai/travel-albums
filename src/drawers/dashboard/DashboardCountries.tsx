import SolidChip from '@/components/SolidChip';
import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import countriesWorker from '@/hooks/sections/workers/countries.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Divider, Stack, Typography } from '@mui/material';
import { Globe } from 'lucide-react';

export default function DashboardCountries() {
  const photosGps = useFilteredGpsPhotos_GLOBAL();
  const sectionPhotos = countriesWorker(photosGps)

  return (
    <SettingsSection title="Countries" icon={<Globe />} >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap', height: '100%' }}>
        <Stack direction={'row'}   divider={<Divider orientation="vertical" sx={{ borderStyle: 'dotted' }} flexItem /> } sx={{ flexWrap: 'wrap', gap: 2 }} >
          {sectionPhotos?.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
            <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
              <Typography variant="caption" color="textDisabled">{item.name}</Typography>
              <SolidChip count={item.photos.length} />
            </Box>
          ))}
        </Stack>
      </Box>
    </SettingsSection>
  );
}
