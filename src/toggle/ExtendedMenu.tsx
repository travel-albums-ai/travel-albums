import { GenericToggleButtonProps } from '@/components/generics/GenericToggleButton';
import GenericToggleButtonGroup from '@/components/generics/GenericToggleButtonGroup';
import PageRedirect from '@/layout/StatusBar/components/PageRedirect';
import LocaleToggle from '@/toggle/LocaleToggle';
import { Divider, Stack } from '@mui/material';
import { EllipsisVertical, ScrollText, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ExtendedMenu() {
  const { t } = useTranslation();

  return <GenericToggleButtonGroup asGroup={true}
    id="extended-menu-toggle"
    variant="standard"
    items={[
      {
        tooltip: t('openSectionsSettings'),
        icon: <EllipsisVertical />,
        popover: <>
          <Stack direction="column" spacing={1} divider={<Divider />}>
            <PageRedirect title={t('settings')} to="/settings" icon={<Settings />} />
            <PageRedirect title={t('copyright')} to="/copyright" icon={<Settings />} />
            <PageRedirect title={t('releaseNotes')} to="/release" icon={<ScrollText />} />
            <LocaleToggle />
          </Stack>
        </>,
      },
    ] satisfies GenericToggleButtonProps[]}
  />
}
