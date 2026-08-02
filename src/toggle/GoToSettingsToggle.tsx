import PageRedirect from '@/layout/StatusBar/components/PageRedirect';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GoToSettingsToggle() {
  const { t } = useTranslation()

  return <PageRedirect title={t('settings')} to="/settings" icon={<Settings size={16} />} skipTitle />
}

export const meta = {
  id: "goToSettings",
  group: ['header'],
  toolbar: [
    {
      id: 'header',
      side: 'right',
      priority: 500
    }
  ],
  component: GoToSettingsToggle,
  priority: 70
};
