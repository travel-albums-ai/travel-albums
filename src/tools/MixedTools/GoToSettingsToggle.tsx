import PageRedirect from '@/components/PageRedirect';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function GoToSettingsToggle() {
  const { t } = useTranslation()

  return <PageRedirect title={t('settings')} to="/settings" icon={<Settings size={16} />} skipTitle />
}
