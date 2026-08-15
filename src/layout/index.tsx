import { useSettingsStoreSelector } from '@/context/settingsStore';
import MainDriver from '@/drivers/MainDriver';
import StatusBar from '@/layout/StatusBar';
import NoServerWindow from '@/windows/NoServerWindow';
import OnboardingWindow from '@/windows/OnboardingWindow';
import 'flexlayout-react/style/combined.css';

import WebMCPDataView from '@/components/WebMCPDataView';
import FlexLayout from '@/layout/FlexLayout';
import Header from '@/layout/Header';
import SettingsWindow from '@/windows/SettingsWindow';

export default function AppLayout() {
  const settingsStore = useSettingsStoreSelector((state) => state);

  return (
    <>
      <Header />

      <NoServerWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <MainDriver />

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

      <FlexLayout />

      <StatusBar />
    </>
  );
}
