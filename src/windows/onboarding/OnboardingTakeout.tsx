import OnboardingButton from '@/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { FolderOutput, GalleryVerticalEnd, SquareMousePointer } from 'lucide-react';
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
      <img src="/googleTakeout.png" alt="Google Takeout"  style={{ width: '100%', borderRadius: 8 }} />
      <OnboardingButton href="https://takeout.google.com/settings/takeout" label={'Open Google Takeout...'} />
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapper>
  </>)
}
