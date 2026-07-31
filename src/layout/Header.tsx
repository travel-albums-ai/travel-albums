import GroupToolbarItems from '@/layout/components/GroupToolbarItems';
import SearchModal from '@/layout/Header/SearchModal';
import PageRedirect from '@/layout/StatusBar/components/PageRedirect';
import DarkLightStatus from '@/toggle/DarkLightStatus';
import ExtendedMenu from '@/toggle/ExtendedMenu';
import FullscreenToggle from '@/toggle/FullscreenToggle';
import NavigationToggle from '@/toggle/NavigationToggle';
import TutorialToggle from '@/toggle/TutorialToggle';
import { Divider, Stack, Theme } from '@mui/material';
import { Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Header() {
  const { t } = useTranslation()
  return (
    <Stack sx={wrapperSx} divider={<Divider orientation="vertical" flexItem />} direction="row" id="header">
      <NavigationToggle />
      <SearchModal />
      <GroupToolbarItems>
        <PageRedirect title={t('settings')} to="/settings" icon={<Settings size={16} style={{ margin: '0 8px' }} />} skipTitle />
        {/* <GeneralSettingsToggle /> */}
        <DarkLightStatus />
        <FullscreenToggle />
        <TutorialToggle />
        <ExtendedMenu />
      </GroupToolbarItems>
    </Stack>
  )
}

const wrapperSx = {
  display: 'flex',
  borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 1,
  px: 1,
  pt: 0.75,
  pb: 0.75,
  bgcolor: 'background.default',
}
