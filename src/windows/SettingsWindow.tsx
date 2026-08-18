import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsContent from '@/windows/components/SettingsContent';
import { Dialog } from '@mui/material';

export default function SettingsWindow() {
  const showSettings = useSettingsStoreSelector(s => s.showSettings)
  const { setSetting } = useSettings()

  const showWindow = showSettings === true

  if (!showWindow) {
    return null
  }

  return (<>
    <Dialog open={showWindow} fullWidth maxWidth="xl" onClose={() => setSetting(prev => ({ ...prev, showSettings: false }))}>
      <SettingsContent />
    </Dialog>
  </>)
}
