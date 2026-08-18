import GenericPanel from '@/components/generics/GenericPanel';
import DashboardCities from '@/drawers/dashboard/DashboardCities';
import DashboardComments from '@/drawers/dashboard/DashboardComments';
import DashboardCountries from '@/drawers/dashboard/DashboardCountries';
import DashboardCountriesMap from '@/drawers/dashboard/DashboardCountriesMap';
import DashboardFriends from '@/drawers/dashboard/DashboardFriends';
import DashboardLikes from '@/drawers/dashboard/DashboardLikes';
import DashboardMetrics from '@/drawers/dashboard/DashboardMetrics';
import DashboardMostRecent from '@/drawers/dashboard/DashboardMostRecent';
import DashboardSuggestions from '@/drawers/dashboard/DashboardSuggestions';
import DashboardViews from '@/drawers/dashboard/DashboardViews';
import { Box, Typography } from '@mui/material';

const foo = true

export default function DashboardDrawer() {

  return (
    <GenericPanel id="dashboard-drawer">
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', gap: 2}}>
        {foo && <Box sx={{ borderBottom: '1px dotted', my: 16, borderColor: 'divider', p: 2, display: 'flex', flexDirection: 'column', gap: 4, alignItems: 'center', justifyContent: 'center' }}>
          <Typography color="textPrimary" sx={{ textAlign: 'center', py: 8 }} variant="h5">Welcome to Travel-Albums</Typography>
          <DashboardSuggestions />
        </Box>}

        <Box sx={{
          display: 'grid',
          width: '1400px',
          gridTemplateColumns: 'repeat(1, 1fr)',
          gap: 2,
        }}
        >

          <DashboardMetrics />
          <DashboardMostRecent />
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'stretch',
          width: '1400px',
          justifyContent: 'stretch',
          gap: 2
        }}
        >
          <DashboardComments />
          <DashboardViews />
          <DashboardLikes />
        </Box>

        <Box sx={{
          display: 'grid',
          width: '1400px',
          gridTemplateColumns: 'repeat(1, 1fr)',
          alignItems: 'start',
          justifyContent: 'start',
          gap: 2, mb: 8,
        }}
        >

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
