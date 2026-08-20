import { useSettingsStoreSelector } from '@/context/settingsStore';
import NoServer from '@/middleware/windows/noServer/NoServerWindow';
import { Dialog } from '@mui/material';

export default function NoServerWindow() {
  const serverOnline = useSettingsStoreSelector(s => s.serverOnline)
  const onboarding = useSettingsStoreSelector(s => s.onboarding)

  const showWindow = onboarding ? false : serverOnline === false

  if (!showWindow) return null

  return (
    <Dialog
      onClose={() => {}}
      open={showWindow}
      fullWidth
    >
      <NoServer />
    </Dialog>
  )
}
