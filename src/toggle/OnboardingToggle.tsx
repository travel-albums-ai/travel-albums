import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import { DoorOpen } from 'lucide-react';

export default function OnboardingToggle() {
  const { setSetting } = useSettings()
  const onboarding = useSettingsStoreSelector((state) => state.onboarding);

  return <GenericToggleButtonGroup variant="standard" items={[
    {
      tooltip: 'Toggle onboarding',
      icon: <DoorOpen />,
      onClick: () => setSetting((prev) => ({ ...prev, onboarding: !onboarding })) ,
      selected: onboarding,
    },
  ] as GenericToggleButtonProps[]} />
}
