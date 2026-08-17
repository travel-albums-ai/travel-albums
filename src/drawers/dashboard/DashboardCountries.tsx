import SolidChip from '@/components/SolidChip';
import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import DashboardPreviewImages from '@/drawers/dashboard/DashboardPreviewImages';
import countriesWorker from '@/hooks/sections/workers/countries.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Typography } from '@mui/material';
import { Globe } from 'lucide-react';

const size = 60;

export default function DashboardCountries() {
  const photosGps = useFilteredGpsPhotos_GLOBAL();
  const sectionPhotos = countriesWorker(photosGps)

  return (
    <SettingsSection title="Countries" icon={<Globe />} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {sectionPhotos?.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
          <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start', gap: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
              <div className={`fflag fflag-${item.avatar}`} style={{ width: 16, height: 16, borderRadius: 10 }} />
              <Typography variant="caption" color="textDisabled">{item.name}</Typography>
              <SolidChip count={item.photos.length} />
            </Box>

            <DashboardPreviewImages photos={item.photos} />
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
