import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import DashboardCitiesItem from '@/drawers/dashboard/DashboardCitiesItem';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box } from '@mui/material';
import { Globe } from 'lucide-react';
import { useMemo } from 'react';

export default function DashboardCities() {
  const photosGps = useFilteredGpsPhotos_GLOBAL();
  const sectionPhotos = citiesWorker(photosGps);

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

  const groups = useMemo(
    () =>
      Array.from(groupByAvatar.entries()).sort(
        (a, b) => b[1].length - a[1].length,
      ),
    [groupByAvatar],
  );

  return (
    <SettingsSection title="Cities" icon={<Globe />}>
      <Box
        sx={{
          height: '100%',
          overflow: 'auto',
          columnWidth: 500,
          columnGap: 3,
        }}
      >
        {groups.map(([avatar, cities]) => (
          <Box
            key={avatar}
            sx={{
              breakInside: 'avoid',
              WebkitColumnBreakInside: 'avoid',
              marginBottom: 2,
            }}
          >
            <DashboardCitiesItem
              avatar={avatar}
              cities={cities}
            />
          </Box>
        ))}
      </Box>
    </SettingsSection>
  );
}
