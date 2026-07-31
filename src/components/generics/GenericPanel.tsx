import { Box } from '@mui/material';
import { useState } from 'react';

export default function GenericPanel({ id, toolbar, children }: { id?: string; toolbar?: React.ReactNode; children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Box id={id} sx={{
      display: 'flex',
      flexDirection: 'column',
      width: 'auto',
      height: '100%',
      flex: '1 1 auto',
    }}>
      {!collapsed && toolbar && <Box sx={wrapperSx} >
        {toolbar}
      </Box>}
      {toolbar && <Box sx={{
        width: '100%',
        height: '2px',
        display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer',
        position: 'relative',
        zIndex: 999,

      }}>
        <Box onClick={() => setCollapsed(!collapsed)} sx={{
          position: 'absolute', top: !collapsed ? '-4px' : '0px', bgcolor: 'background.default', zIndex: 1, '&:hover': { bgcolor: 'background.default' },
          border: '1px solid', borderColor: 'divider',
          boxShadow: 2,
          borderRadius: '2px 2px 8px 8px',
          px: 1,
          py: 0,
          lineHeight: '16px',
          opacity: 0.2,
          '&:hover': { opacity: 1 }
        }}>
          -
        </Box>
      </Box>}
      <Box sx={boxSx}>
        {children}
      </Box>
    </Box>
  )
}

const wrapperSx = {
  display: 'flex',
  alignItems: 'center',
  boxShadow: 2,
  m: 0.75,
  mb: 0.5,
  borderRadius: 2,
  bgcolor: 'background.default',
  justifyContent: 'space-between',
  py: 0.75,
  px: 1
}

const boxSx = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  overflow: 'auto',
  position: 'relative',
  gap: 0.5,
  flex: '1 1 auto',
  pt: 0.5,
  px: 1,
}
