import { useSettingsStoreSelector } from '@/context/settingsStore';
import Onboarding from '@/middleware/windows/onboarding';
import { Dialog } from '@mui/material';

export default function OnboardingWindow() {
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);

  const showWindow = onboarding === true

  if (!showWindow) {
    return null
  }

  return (<>
    <Dialog
      onClose={() => { }}
      open={onboarding}
      fullWidth
      slotProps={{
        paper: {
          sx: {
            width: 700,
            height: 950,
            maxWidth: 'none',
            maxHeight: 'none',
          },
        },
      }}
    >
      <Onboarding />
    </Dialog>
  </>)
}
