import { Box, Divider, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function OnboardingTakeout() {
  const { t } = useTranslation();

  return (<>
    <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, mx: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <img
        src="./logo_new_240.webp"
        alt="Logo"
        fetchPriority="high"
        width={240}
        height={186}
        style={{
          aspectRatio: '1/1',
          margin: 20
        }}
      />
      <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="body1" color="textPrimary">
        {t('onboardingWelcomeBody')}
      </Typography>

      <Divider sx={{ width: '100%' }} />
      <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="subtitle2" color="textSecondary">
        {t('onboardingWelcomeSubtitle')}
      </Typography>

      <Typography sx={{ p: 2, pt: 0, lineHeight: 2 }} variant="caption" color="textDisabled">
        {t('onboardingWelcomeFooter')}
      </Typography>

    </Box>
  </>)
}
