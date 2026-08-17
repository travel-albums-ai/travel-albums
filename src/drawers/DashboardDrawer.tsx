import GenericPanel from '@/components/generics/GenericPanel';
import DashboardCities from '@/drawers/dashboard/DashboardCities';
import DashboardComments from '@/drawers/dashboard/DashboardComments';
import DashboardCountries from '@/drawers/dashboard/DashboardCountries';
import DashboardCountriesMap from '@/drawers/dashboard/DashboardCountriesMap';
import DashboardFriends from '@/drawers/dashboard/DashboardFriends';
import DashboardMetrics from '@/drawers/dashboard/DashboardMetrics';
import DashboardSuggestions from '@/drawers/dashboard/DashboardSuggestions';
import { Box, Typography } from '@mui/material';

export default function DashboardDrawer() {

  return (
    <GenericPanel id="dashboard-drawer">
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center'}}>
        {true && <Box sx={{ borderBottom: '1px dotted', my: 16, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textPrimary" sx={{ textAlign: 'center', py: 8 }} variant="h5">Welcome to Travel-Albums</Typography>
          <DashboardSuggestions />
          <DashboardMetrics />
        </Box>}
        <Box sx={{
          display: 'grid',
          width: '1400px',
          gridTemplateColumns: 'repeat(1, 1fr)',
          alignItems: 'start',
          justifyContent: 'start',
          gap: 2, px: 4
        }}
        >
          <DashboardComments />
          <DashboardFriends />

          <DashboardCountriesMap />
          <DashboardCountries />

          <DashboardCities />

        </Box>
      </Box>
    </GenericPanel>
  );
}

{/* <div>Recent files</div>  */}
