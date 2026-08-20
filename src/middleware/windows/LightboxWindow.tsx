import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { Dialog } from '@mui/material';
import LightboxWindowInner from './lightbox/LightboxWindow';

export default function LightboxWindow() {
  const lightboxOpen = useSettingsStoreSelector(s => s.lightboxOpen);
  const { setSetting } = useSettings();

  const showWindow = lightboxOpen === true;

  if (!showWindow) return null

  return (
    <Dialog
      fullWidth
      fullScreen
      open={showWindow}
      onClose={() => setSetting(prev => ({ ...prev, lightboxOpen: false}))}
      slotProps={{
        paper: {
          sx: {
            width: '90vw',
            height: '90vh',
            maxHeight: '90vh',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}}}
    >
      <LightboxWindowInner />
    </Dialog>
  )
}
