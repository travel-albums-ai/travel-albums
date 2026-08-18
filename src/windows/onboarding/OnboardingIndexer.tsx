import ServerStatus from '@/base/ServerStatus';
import OnboardingButton from '@/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { PackageOpen, Play, SquareMousePointer } from 'lucide-react';
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
      <img src="/image.1.png" alt="Releases" style={{ width: '100%', borderRadius: 8 }} />
      <OnboardingButton href="https://github.com/travel-albums-ai/albums-google-photos-indexer/releases" label="Open Indexer Releases..." />
      <ServerStatus />
      <OnboardingPhasesList phaseSteps={phaseSteps} />

    </OnboardingWrapper>
  </>)
}
