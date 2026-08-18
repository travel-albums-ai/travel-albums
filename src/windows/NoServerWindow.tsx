import { useSettingsStoreSelector } from '@/context/settingsStore';
import { Box, Dialog, Typography } from '@mui/material';
import { TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NoServerWindow() {
  const serverOnline = useSettingsStoreSelector(s => s.serverOnline)
  const onboarding = useSettingsStoreSelector(s => s.onboarding)
  const { t } = useTranslation();

  const showWindow = onboarding ? false : serverOnline === false

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
        py: 4,
      }}>
        <TriangleAlert size={60} color="orange"  />
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{t('noServerConnectionTitle')}</Typography>
        <Typography variant="body1" align="center" sx={{ px: 4 }} color="textSecondary">
          {t('noServerConnectionBody')}
        </Typography>

      </Box>
    </Dialog>
  </>)
}
