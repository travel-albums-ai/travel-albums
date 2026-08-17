import GenericPanel from '@/components/generics/GenericPanel';
import DashboardCities from '@/drawers/dashboard/DashboardCities';
import DashboardComments from '@/drawers/dashboard/DashboardComments';
import DashboardCountries from '@/drawers/dashboard/DashboardCountries';
import DashboardCountriesMap from '@/drawers/dashboard/DashboardCountriesMap';
import DashboardFriends from '@/drawers/dashboard/DashboardFriends';
import DashboardMetrics from '@/drawers/dashboard/DashboardMetrics';
import DashboardSuggestions from '@/drawers/dashboard/DashboardSuggestions';
import { Box, Typography } from '@mui/material';

const bla = true

export default function DashboardDrawer() {

  return (
    <GenericPanel id="dashboard-drawer">
      <Box sx={{ display: 'flex', justifyContent: 'center'}}>
        <Box sx={{
          display: 'grid',
          maxWidth: '1400px',
          gridTemplateColumns: 'repeat(1, 1fr)',
          alignItems: 'start',
          justifyContent: 'start',

          gap: 2, px: 4 }}>


          <Box sx={{ borderBottom: '1px solid', borderColor: 'divider', p: 2, display: 'flex;ex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="primary" sx={{ mt: 16, textAlign: 'center' }} variant="h5">Welcome to Travel-Albums</Typography>

            <DashboardSuggestions />

            <DashboardMetrics />
          </Box>


          {bla && <>
            <DashboardComments />
            <DashboardFriends />
            <DashboardCountriesMap />
            <DashboardCountries />
          </>}


          <DashboardCities />

        </Box>
      </Box>
    </GenericPanel>
  );
}

{/* <div>Recent files</div>  */}
