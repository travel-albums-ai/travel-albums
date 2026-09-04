import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import ReactFlowWrapper from '@/middleware/windows/pipeline/ReactFlowWrapper';
import { Dialog } from '@mui/material';

export default function PipelineWindow() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()

  const showWindow = true

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}
      slotProps={{
        paper: {
          sx: {
            width: '95vw',
            height: '95vh',
            maxHeight: '95vh',
            maxWidth: '95vw',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          },
        },
      }}
    >
      <ReactFlowWrapper />
    </Dialog>
  )
}
