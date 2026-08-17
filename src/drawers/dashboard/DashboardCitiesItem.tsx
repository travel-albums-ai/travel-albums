import SolidChip from '@/components/SolidChip';
import DashboardPreviewImages from '@/drawers/dashboard/DashboardPreviewImages';
import SettingsSection from '@/windows/components/SettingsSection';
import { Box, Stack, Typography } from '@mui/material';

export default function DashboardCitiesItem({ avatar, cities }) {

  const citiesWithPreview = cities?.sort((a, b) => b.photos.length - a.photos.length)
    .filter((item) => item.photos.length > 100)

  const citiesWithoutPreview = cities?.sort((a, b) => b.photos.length - a.photos.length)
    .filter((item) => item.photos.length <= 100)

  return (
    <SettingsSection>
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
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'stretch', gap: 1, width: '100%' }}>
          {citiesWithPreview.length > 0 && <Box sx={{
            display: 'grid',
            width: '100%',
            gap: 4,
            rowGap: 2,
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            borderBottom: '1px dotted', borderColor: 'divider', pb: 2, mb: 2
          }}>
            {citiesWithPreview.map((item) => <>
              {item.photos.length > 100 && <Box key={item.name} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'stretch', gap: 1 }}>
                <DashboardPreviewImages photos={item.photos} size={50} count={5} />
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <Typography variant="caption" color="textDisabled">{item.name}</Typography>
                  <SolidChip count={item.photos.length} />
                </Box>
              </Box>}

            </>)}
          </Box>}
          {citiesWithoutPreview.length > 0 && <Stack direction={'row'} sx={{ flexWrap: 'wrap', gap: 2 }} >
            {citiesWithoutPreview.map((item) => <>
              <Box key={item.name} sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                <Typography variant="caption" color="textDisabled">{item.name}</Typography>
                <SolidChip count={item.photos.length} />
              </Box>
            </>)}
          </Stack>}
        </Box>
      </Box>
    </SettingsSection>
  );
}
