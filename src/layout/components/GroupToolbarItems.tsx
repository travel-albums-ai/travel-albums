import { Box } from '@mui/material';

export default function GroupToolbarItems({ children }: { children?: React.ReactNode }) {

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      { children }
    </Box>
  )
}
