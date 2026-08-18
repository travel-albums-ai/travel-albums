import ServerStatus from '@/base/ServerStatus';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { Box, Divider, Typography } from '@mui/material';
import { PackageOpen, Play, SquareMousePointer } from 'lucide-react';
import { cloneElement } from 'react';
import { useTranslation } from 'react-i18next';

const phaseSteps = [
  {
    key: '1',
    icon: <SquareMousePointer />,
    titleKey: "Download the Indexer",
    descriptionKey: 'Go to https://github.com/travel-albums-ai/albums-google-photos-indexer/releases and download the latest version of the Indexer for your operating system.',
  },
  {
    key: '2',
    icon: <PackageOpen />,
    titleKey: "Unpack the Indexer",
    descriptionKey: 'After downloading, unpack the Indexer to a location of your choice.',
  },
  {
    key: '3',
    icon: <Play />,
    titleKey: "Run the Indexer",
    descriptionKey: 'After unpacking, run the Indexer to start indexing your photos.',
  },
]

export default function OnboardingIndexer() {
  const { t } = useTranslation();

  return (<>
    <OnboardingWrapper>
      <img src="/image.1.png" alt="Releases" height={235} style={{ width: '100%', borderRadius: 8 }} />
      {phaseSteps.map((step, i) => (
        <Box key={step.key} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 2, width: '100%', px: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            {cloneElement(step.icon, { size: 16 })}
            <Typography variant="subtitle1">{t(step.titleKey)}</Typography>
            {i === 2 && <ServerStatus />}
          </Box>
          <Typography variant="subtitle2" color="textSecondary">{t(step.descriptionKey)}</Typography>
          {i < phaseSteps.length - 1 && <Divider sx={{ width: '100%' }} />}
        </Box>
      ))}

    </OnboardingWrapper>
  </>)
}
