import { useSettingsStoreSelector } from '@/context/settingsStore';
import SettingsPopover from '@/settings/SettingsPopover';
import { Box, Dialog, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function NoServerModal() {
  const serverOnline = useSettingsStoreSelector(s => s.serverOnline)
  const demoMode = useSettingsStoreSelector(s => s.demoMode)
  const { t } = useTranslation();

  return (<>
    <Dialog onClose={() => { }} open={serverOnline === false && demoMode !== true} fullWidth sx={{ backdropFilter: 'blur(8px)', }} >
      <Box sx={{
        p: 4, display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 2,
        borderRadius: 2, boxShadow: 3,
        border: 1, borderColor: 'divider',
        m: 2, bgcolor: 'background.paper'
      }}>
        <Box sx={{ fontSize: 48 }}>⚠️</Box>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('noServerConnectionTitle')}</Typography>
        <Typography variant="body1" align="center" color="textSecondary">
          {t('noServerConnectionBody')}
        </Typography>

        <SettingsPopover />
      </Box>

    </Dialog>
  </>)
}
