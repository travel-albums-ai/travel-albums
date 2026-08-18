import IndexerContent from '@/components/IndexerContent';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { Box, Divider, Typography } from '@mui/material';
import { Coffee } from 'lucide-react';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <Coffee />,
    titleKey: "Time for a coffee break",
    descriptionKey: 'While the indexer is running, you can take a break and enjoy a cup of coffee. The indexing process may take some time depending on the number of photos you have.',
  },
]

export default function OnboardingIndexing() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <Box sx={{ flex: 0, width: '100%', bgcolor: 'background.default', borderRadius: 2}}>
        <IndexerContent />
      </Box>
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

    </OnboardingWrapper>
  </>)
}
