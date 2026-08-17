import WebMCPDataView from '@/components/WebMCPDataView';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import MainDriver from '@/drivers/MainDriver';
import FlexLayout from '@/layout/FlexLayout';
import Header from '@/layout/Header';
import StatusBar from '@/layout/StatusBar';
import LightboxWindow from '@/windows/LightboxWindow';
import NoServerWindow from '@/windows/NoServerWindow';
import OnboardingWindow from '@/windows/OnboardingWindow';
import SettingsWindow from '@/windows/SettingsWindow';

export default function AppLayout() {
  const settingsStore = useSettingsStoreSelector((state) => state);

  return (
    <>
      <NoServerWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <MainDriver />
      <LightboxWindow />

      <WebMCPDataView
        name="check_settings_store"
        description="Get current settings store"
        execute={async () => ({
          content: [{
            type: 'text',
            text: `Current settings store is ${JSON.stringify(settingsStore)}.`
          }]
        })}
      />

      {/* // Render the main layout */}

      <Header />

      <FlexLayout />

      <StatusBar />
    </>
  );
}
