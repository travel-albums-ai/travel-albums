import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export default function PageRedirect({ title, to, icon, skipTitle }: { title: string, to: string, icon: React.ReactNode, skipTitle?: boolean }) {
  const { t } = useTranslation()
  const navigate = useNavigate();

  return <>
    <GenericToggleButtonGroup variant="standard"
      items={[
        {
          tooltip: t('goToPage', { title }),
          title: skipTitle ? undefined : title,
          icon,
          onClick: () => navigate(to),
        },
      ] satisfies GenericToggleButtonProps[]}
    />
  </>
}
