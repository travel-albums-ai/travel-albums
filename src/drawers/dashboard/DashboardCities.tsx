import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import DashboardCitiesItem from '@/drawers/dashboard/DashboardCitiesItem';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box } from '@mui/material';
import { Globe } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardCities() {
  const photosGps = useFilteredGpsPhotos_GLOBAL();
  const sectionPhotos = citiesWorker(photosGps)

  const groupByAvatar = useMemo(() => {
    const groups = new Map<string, typeof sectionPhotos>();

    for (const city of sectionPhotos ?? []) {
      const existing = groups.get(city.avatar);

      if (existing) {
        existing.push(city);
      } else {
        groups.set(city.avatar, [city]);
      }
    }

    return groups;
  }, [sectionPhotos]);

  console.log(sectionPhotos)

  return (
    <SettingsSection title="Cities" icon={<Globe />} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 4, flexWrap: 'wrap', height: '100%' }}>
        {Array.from(groupByAvatar.entries())
          .sort((a,b) => b[1].length - a[1].length)
          .map(([avatar, cities]) => (
            <DashboardCitiesItem avatar={avatar} cities={cities} key={avatar} />
          ))}
      </Box>
    </SettingsSection>
  );
}
