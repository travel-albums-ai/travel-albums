import { Box } from '@mui/material';

export default function OnboardingWrapper({ children }: { children: React.ReactNode }) {

  return (<>
    <Box sx={{
      p: 2,
      boxShadow: 1,
      borderRadius: 2,
      mx: 2,
      bgcolor: 'background.paper',
      border: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2,
      height: '750px',
      overflowY: 'auto',
    }}>
      {children}
    </Box>
  </>)
}
