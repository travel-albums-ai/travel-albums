import SolidChip from '@/components/SolidChip';
import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Stack, Typography } from '@mui/material';
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

  return (
    <SettingsSection title="Cities" icon={<Globe />} >
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: 2, flexWrap: 'wrap', height: '100%' }}>
        {Array.from(groupByAvatar.entries())
        // .sort((a,b) => a[1].length > b[1].length)
          .map(([avatar, cities]) => (
            <SettingsSection >
              <Box
                key={avatar}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 2,
                }}
              >
                <div
                  className={`fflag fflag-${avatar}`}
                  style={{
                    width: 16,
                    height: 16,
                    borderRadius: 10,
                    flexShrink: 0,
                  }}
                />
                <Stack direction={'row'} sx={{ flexWrap: 'wrap', gap: 2 }} >
                  {cities?.sort((a, b) => a.name.localeCompare(b.name)).map((item) => (
                    <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                      <Typography variant="caption" color="textDisabled">{item.name}</Typography>
                      <SolidChip count={item.photos.length} />
                    </Box>
                  ))}
                </Stack>
              </Box>
            </SettingsSection>
          ))}
      </Box>
    </SettingsSection>
  );
}
