import IndexerContent from '@/components/IndexerContent';
import IndexerSettings from '@/components/IndexerSettings';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { Box, Divider, Typography } from '@mui/material';
import { Code, RefreshCw } from 'lucide-react';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <Code />,
    titleKey: "Configure the source and cache folder",
    descriptionKey: 'Configure the source folder where your Google Takeout photos are located and the cache folder where the indexer will store its data.',
  },
  {
    key: '2',
    icon: <RefreshCw />,
    titleKey: "Let it run",
    descriptionKey: 'Wait for the indexer to finish indexing your photos. This may take some time depending on the number of photos you have.',
  },
]

export default function OnboardingFolders() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <Box sx={{ flex: 0, width: '100%', bgcolor: 'background.default', borderRadius: 2, p: 1 }}>
        <IndexerSettings asIs />
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
      <Box sx={{ flex: 0, width: '100%', bgcolor: 'background.default', borderRadius: 2}}>
        <IndexerContent />
      </Box>
    </OnboardingWrapper>
  </>)
}
