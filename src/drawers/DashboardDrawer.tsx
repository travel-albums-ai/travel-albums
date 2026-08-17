import GenericPanel from '@/components/generics/GenericPanel';
import DashboardCities from '@/drawers/dashboard/DashboardCities';
import DashboardComments from '@/drawers/dashboard/DashboardComments';
import DashboardCountries from '@/drawers/dashboard/DashboardCountries';
import DashboardFriends from '@/drawers/dashboard/DashboardFriends';
import DashboardMetrics from '@/drawers/dashboard/DashboardMetrics';
import DashboardSuggestions from '@/drawers/dashboard/DashboardSuggestions';
import { Box, Typography } from '@mui/material';

export default function DashboardDrawer() {

  return (
    <GenericPanel id="dashboard-drawer">




      <Box sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(1, minmax(550px, 1fr))',
        alignItems: 'start',
        justifyContent: 'start',

        gap: 2, px: 4 }}>

        <Typography color="primary" sx={{ mt: 16, textAlign: 'center' }} variant="h5">Welcome to Travel-Albums</Typography>

        <DashboardSuggestions />

        <DashboardMetrics />

        {/* <div>suggestions</div>
        <div>ENable AI</div>

        <div>Database metrics</div>

        <div>Recent files</div> */}

        {/* <div>Most commented</div> */}
        <DashboardComments />


        {/* <div>Friends</div> */}
        <DashboardFriends />

        {/* <div>Countries</div> */}
        <DashboardCountries />

        {/* <div>Cities</div> */}
        <DashboardCities />

      </Box>
    </GenericPanel>
  );
}
