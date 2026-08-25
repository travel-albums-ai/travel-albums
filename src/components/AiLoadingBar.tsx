import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Box } from '@mui/material';

export default function AiLoadingBar() {
  const loading = useSettingsStoreSelector((state) => state.loading);
  const loadingValue = useSettingsStoreSelector((state) => state.loadingValue);

  return (
    <>
      <Box id="ai-loading" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.5, border: '1px solid red', zIndex: 9999, pointerEvents: 'none' }}>


      </Box>
      {/* <LinearProgress variant="indeterminate" sx={{ position: 'absolute', top: 2, left: 0, right: 0, height: 24, opacity: 0.05, pointerEvents: 'none' }} /> */}
      {/* </>} */}
    </>
  )
}
