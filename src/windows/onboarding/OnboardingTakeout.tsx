import { Box, Divider, Typography } from '@mui/material';
import { FolderOutput, GalleryVerticalEnd, SquareMousePointer } from 'lucide-react';
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
    <Box sx={{ p: 2, boxShadow: 1, borderRadius: 2, mx: 2, bgcolor: 'background.paper', border: 1, borderColor: 'divider', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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
    </Box>
  </>)
}
