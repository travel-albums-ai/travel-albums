import GeneralToolbar from '@/layout/components/GeneralToolbar';
import { toolbarRegistry } from '@/toolbarRegistry';
import { Box, Stack, Typography } from '@mui/material';

export default function ToolbarsPopover() {
  const toolbars = toolbarRegistry.all()

  const toolbarIds = [...new Set(toolbars.map((toolbar) => toolbar.toolbar?.flatMap((item) => item.id)).flat().filter(Boolean) as string[])]

  return <>
    <Stack sx={{ gap: 0.5, height: '600px', overflow: 'auto' }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {toolbarIds.map((toolbarId) => {
        const toolbar = toolbars.find((toolbar) => toolbar.toolbar?.some((item) => item.id === toolbarId))
        if (!toolbar) {
          return null
        }

        return <Box key={toolbarId} sx={{ display: 'flex', pointerEvents: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
          <Typography variant="caption" color="textSecondary">{toolbarId}</Typography>
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <GeneralToolbar group={toolbarId} context={{ sidebarSearchOpen: false }} />
          </Box>
        </Box>
      })}

    </Stack>
  </>
}
