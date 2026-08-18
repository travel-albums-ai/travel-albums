import OnboardingButton from '@/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/windows/onboarding/OnboardingWrapper';
import { FolderOutput, SquareMousePointer } from 'lucide-react';

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
]

export default function OnboardingTakeout() {

  return (<>
    <OnboardingWrapper>
      <img src="/googleTakeout.png" alt="Google Takeout"  style={{ width: '100%', borderRadius: 8 }} />
      <OnboardingButton href="https://takeout.google.com/settings/takeout" label={'Open Google Takeout...'} />
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapper>
  </>)
}
