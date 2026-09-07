// ============================================================
// Palette of node types that can be dragged onto the canvas
// ============================================================

import { useSettingsStoreSelector } from '@/context/settingsStore';
import { paletteItems } from '@/middleware/windows/pipeline/NodeToolbox';
import { Box, Typography, useTheme } from '@mui/material';
import { cloneElement } from 'react';
import stc from 'string-to-color';

function NodeHeader({ type, sx } : { type: string, sx?: object }) {
  const theme = useTheme();
  const performanceMode = useSettingsStoreSelector(s => s.performanceMode)

  const relevantPaletteItem = paletteItems.find(item => item.type === type);

  return <>
    <Box
      sx={{
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 1,
        py: 0.75,
        px: 1,
        borderRadius: 2,
        border: '1px solid',

        borderColor: 'divider',
        borderBottom: '1px solid',
        borderBottomColor: `color-mix(in srgb, color-mix(in srgb, ${stc(type)} 50%, ${stc(relevantPaletteItem?.group)} 70%) 35%, ${theme.palette.text.primary} 25%)`,
        background: performanceMode
          ? `color-mix(in srgb, color-mix(in srgb, ${stc(type)} 2%, ${stc(relevantPaletteItem?.group)} 8%) 100%, ${theme.palette.background.paper} 45%)`
          : `linear-gradient(
                    90deg,
                    transparent 0%,
                    color-mix(in srgb, ${stc(type)} 2%, ${stc(relevantPaletteItem?.group)} 8%) 125%
                  )`,
        ...sx,

      }}
    >
      {relevantPaletteItem?.icon !== undefined && cloneElement(relevantPaletteItem?.icon, { size: 16, style: {
        color: `color-mix(in srgb, color-mix(in srgb, ${stc(type)} 50%, ${stc(relevantPaletteItem?.group)} 100%) 95%, ${theme.palette.text.primary} 50%)`
      } })}
      <Typography variant="caption" color="textSecondary" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {relevantPaletteItem?.label}
      </Typography>
    </Box>
  </>
}

export default NodeHeader;
