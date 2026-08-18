import { useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsPopover from '@/windows/settings/SettingsPopover';
import { Box, Dialog, Typography } from '@mui/material';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NoServerWindow() {
  const serverOnline = useSettingsStoreSelector(s => s.serverOnline)
  const demoMode = useSettingsStoreSelector(s => s.demoMode)
  const { t } = useTranslation();

  const showWindow = serverOnline === false && demoMode !== true

  if (!showWindow) {
    return null
  }

  return (<>
    <Dialog onClose={() => {}} open={showWindow} fullWidth>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
        pt: 4,
      }}>
        <TriangleAlert size={60} color="orange"  />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('noServerConnectionTitle')}</Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {t('noServerConnectionBody')}
        </Typography>

        <Box sx={{ flex: 1, width: '100%', mt: 2 }} >
          <SettingsPopover />
        </Box>
      </Box>
    </Dialog>
  </>)
}
