import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsContent from '@/windows/components/SettingsContent';
import { Box, Dialog } from '@mui/material';

export default function SettingsWindow() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()

  return (<>
    <Dialog open={showSettings} fullWidth maxWidth="xl" onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}>
      <Box sx={{
        p: 2,
        borderRadius: 2,
        border: 2,
        borderColor: 'divider',
        bgcolor: 'background.default',
        height: '65vh',
        overflowY: 'auto',
      }}>
        <SettingsContent />
      </Box>
    </Dialog>
  </>)
}
