import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Typography } from '@mui/material';
import { Globe } from 'lucide-react';

export default function DashboardCities() {
  const photosGps = useFilteredGpsPhotos_GLOBAL();
  const sectionPhotos = citiesWorker(photosGps)

  const groupByAvatar = sectionPhotos.reduce((prev, acc) => {

  }, [])

  return (
    <SettingsSection title="Cities" icon={<Globe />} >
      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {sectionPhotos?.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
          <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
            <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
            <Typography variant="caption" color="textDisabled">{item.name}</Typography>
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
