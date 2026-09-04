import { Box, useTheme } from '@mui/material';

export default function OnboardingWrapperInfo({ children, light = false }: { children: React.ReactNode, light?: boolean }) {
  const theme = useTheme();

  return (<>
    <Box sx={{
      boxShadow: 4,
      borderRadius: 2,
      mx: 2,
      bgcolor: !light ? `${theme.palette.background.paper}CC` : `${theme.palette.background.default}CC`,
      border: 1,
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      overflowY: 'auto',
    }}>
      {children}
    </Box>
  </>)
}
