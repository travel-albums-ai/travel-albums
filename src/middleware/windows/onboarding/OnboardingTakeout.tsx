import OnboardingButton from '@/middleware/windows/onboarding/OnboardingButton';
import OnboardingPhasesList from '@/middleware/windows/onboarding/OnboardingPhasesList';
import OnboardingWrapper from '@/middleware/windows/onboarding/OnboardingWrapper';
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
      <img src="/googleTakeout.png" alt="Google Takeout"  style={{ width: '100%', height: '271px', borderRadius: 8 }} />
      <OnboardingButton href="https://takeout.google.com/settings/takeout" label={'Open Google Takeout...'} />
    </OnboardingWrapper>
    <OnboardingWrapper light={true}>
      <OnboardingPhasesList phaseSteps={phaseSteps} />
    </OnboardingWrapper>
  </>)
}
