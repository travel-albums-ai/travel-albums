import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function NavigationToggle() {
  const { t } = useTranslation()

  return <GenericToggleButtonGroup items={[
    {
      icon: <ArrowLeft />,
      onClick: () => window.history.back(),
      tooltip: t('navBack')
    },
    {
      icon: <ArrowRight />,
      onClick: () => window.history.forward(),
      tooltip: t('navForward')
    },
    {
      icon: <RefreshCw />,
      onClick: () => window.location.reload(),
      tooltip: t('navRefresh')
    },
  ] satisfies GenericToggleButtonProps[]} variant="standard" />
}

export const meta = {
  id: "navigation",
  group: ['header'],
  toolbar: [
    {
      id: 'header',
      side: 'left',
      priority: 0
    }
  ],
  component: NavigationToggle,
  priority: 0
};
