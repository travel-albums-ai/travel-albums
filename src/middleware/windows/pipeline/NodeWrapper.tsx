import { Box, Typography, useTheme } from '@mui/material';
import { cloneElement } from 'react';
import stc from 'string-to-color';

function NodeWrapper({ title, icon, children, toolbar} : { title: string, icon: React.ReactNode, children: React.ReactNode, toolbar?: React.ReactNode }) {
  const theme = useTheme();

  return <>

    <Box
      // id={item.type}
      sx={{
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        mx: 0.25,
        gap: 0,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        // borderBottom: '1px solid',
        borderBottomColor: `color-mix(in srgb, color-mix(in srgb, ${stc(title)} 80%, ${theme.palette.text.primary} 70%) 35%, transparent)`,
        borderTopColor: `color-mix(in srgb, color-mix(in srgb, ${stc(title)} 80%, ${theme.palette.text.primary} 70%) 35%, transparent)`,
        // background: `linear-gradient(
        //             0deg,
        //             transparent 0%,
        //             color-mix(in srgb, ${stc(title)} 12%, transparent) 100%
        //           )`,
        // background: `color-mix(in srgb, color-mix(in srgb, ${stc(title)} 80%, ${theme.palette.text.primary} 70%) 35%, transparent)`,

      }}
      key={title}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 ,
        borderRadius: 2,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        px: 1,
        py: 0.75,
        borderBottom: '1px solid',
        borderBottomColor: `color-mix(in srgb, color-mix(in srgb, ${stc(title)} 80%, ${theme.palette.text.primary} 70%) 35%, transparent)`,
        background: `linear-gradient(
                    90deg,
                    transparent 20%,
                    color-mix(in srgb, ${stc(title)} 10%, transparent) 100%
                  )`,

      }}>
        {/* dddd {typeof icon} */}
        {icon !== undefined && cloneElement(icon as React.ReactElement, { size: 16, style: {
          color: `color-mix(in srgb, color-mix(in srgb, ${stc(title)} 80%, ${theme.palette.text.primary} 70%) 95%, transparent)`
        } })}
        <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1 }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ p: 1, py: 2,
        // bgcolor: theme.palette.background.paper,
        bgcolor: `color-mix(in srgb, ${theme.palette.background.paper} 60%, transparent 100%)`,
        borderRadius: 2 }}>
        {children}
      </Box>

    </Box>
  </>
}

export default NodeWrapper;
