import { Box, Divider, Typography } from '@mui/material';
import { cloneElement, JSX } from 'react';
import { useTranslation } from 'react-i18next';

export default function OnboardingPhasesList({ phaseSteps } : { phaseSteps: { key: string, icon: JSX.Element, titleKey: string, descriptionKey: string }[] }) {
  const { t } = useTranslation();

  return (<>
    {phaseSteps.map((step, i) => (
      <Box key={step.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 1, width: '100%', px: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          {cloneElement(step.icon, { size: 16 })}
          <Typography variant="subtitle1">{t(step.titleKey)}</Typography>
        </Box>
        <Typography variant="subtitle2" color="textSecondary">{t(step.descriptionKey)}</Typography>
        {i < phaseSteps.length - 1 && <Divider sx={{ width: '100%' }} />}
      </Box>
    ))}
  </>)
}
