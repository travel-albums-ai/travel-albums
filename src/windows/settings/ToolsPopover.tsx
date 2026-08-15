import GeneralRegistryToolbar from '@/components/registry/GeneralRegistryToolbar';
import { toolRegistry } from '@/toolRegistry';
import { Box, Stack, Typography } from '@mui/material';

export default function ToolsPopover() {
  const tools = toolRegistry.all()

  const toolIds = [...new Set(tools.map((tool) => tool.tool?.flatMap((item) => item.id)).flat().filter(Boolean) as string[])]

  return <>
    <Stack sx={{ gap: 0.5, height: '600px', overflow: 'auto' }} divider={<Box sx={{ borderBottom: '1px dotted', borderColor: 'divider' }} />} >
      {toolIds.map((toolId) => {
        const tool = tools.find((tool) => tool.tool?.some((item) => item.id === toolId))
        if (!tool) {
          return null
        }

        return <Box key={toolId} sx={{ display: 'flex', pointerEvents: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: 1, p: 1, borderRadius: 1, '&:hover': { bgcolor: 'action.hover' } }}>
          <Typography variant="caption" color="textSecondary">{toolId}</Typography>
          <Box sx={{ width: '100%', overflow: 'auto' }}>
            <GeneralRegistryToolbar group={toolId} context={{ sidebarSearchOpen: false }} />
          </Box>
        </Box>
      })}

    </Stack>
  </>
}
