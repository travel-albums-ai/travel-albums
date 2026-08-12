import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsContent from '@/modals/components/SettingsContent';
import { Box, Dialog } from '@mui/material';

export default function SettingsModal() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()

  return (<>
    <Dialog open={showSettings} fullWidth maxWidth="md" onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}>
      <Box sx={{
        p: 2,
        border: 1, borderColor: 'divider',
        bgcolor: 'background.paper',
        height: '65vh', overflowY: 'auto',
      }}>
        <SettingsContent />
      </Box>
    </Dialog>
  </>)
}
