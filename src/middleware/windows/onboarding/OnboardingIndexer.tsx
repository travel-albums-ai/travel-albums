import ServerStatus from '@/middleware/base/ServerStatus';
import OnboardingButton from '@/middleware/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
import { PlatformDownloadButton } from '@/middleware/windows/onboarding/PlatformDownload';
import { Box } from '@mui/material';
import { PackageOpen, Play, SquareMousePointer } from 'lucide-react';

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

  return (<>
    <OnboardingWrapper>
      <img src="/image.1.png" alt="Releases" style={{ width: '100%', borderRadius: 8, height: '312px' }} />
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', width: '100%' }} >
        <OnboardingButton href="https://github.com/travel-albums-ai/albums-google-photos-indexer/releases" label="Open Indexer Releases..." />
        <ServerStatus />
      </Box>

      <PlatformDownloadButton />
    </OnboardingWrapper>

    <OnboardingWrapper light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapper>
  </>)
}
