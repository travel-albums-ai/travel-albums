import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { Box, Button, Divider, Typography } from '@mui/material';
import { ExternalLink, FolderOutput, GalleryVerticalEnd, SquareMousePointer } from 'lucide-react';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <SquareMousePointer />,
    titleKey: 'onboardingPhaseGoogleTakeoutTitle',
    descriptionKey: 'onboardingPhaseGoogleTakeoutDescription',
  },
  {
    key: '2',
    icon: <FolderOutput />,
    titleKey: 'onboardingPhaseConfigureFoldersTitle',
    descriptionKey: 'onboardingPhaseConfigureFoldersDescription',
  },
  {
    key: '3',
    icon: <GalleryVerticalEnd />,
    titleKey: 'onboardingPhaseIndexTitle',
    descriptionKey: 'onboardingPhaseIndexDescription',
  },
]

export default function OnboardingTakeout() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <img src="/googleTakeout.png" alt="Google Takeout" height={235} style={{ width: '100%', borderRadius: 8 }} />
      {phaseSteps.map((step, i) => (
        <Box key={step.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {cloneElement(step.icon, { size: 16 })}
            <Typography variant="subtitle1">{t(step.titleKey)}</Typography>
          </Box>
          <Typography variant="subtitle2" color="textSecondary">{t(step.descriptionKey)}</Typography>
          {i < phaseSteps.length - 1 && <Divider sx={{ width: '100%' }} />}
        </Box>
      ))}
      <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', width: '100%' }}>
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          <ExternalLink size={16} style={{ marginRight: 8 }} />
          Open Google Takeout...
        </Button>
      </a>
    </OnboardingWrapper>
  </>)
}
