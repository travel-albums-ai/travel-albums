import GenericPanel from '@/components/generics/GenericPanel';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { routeIcons } from '@/icons/IconsIndex';
import GroupToolbarItems from '@/layout/components/GroupToolbarItems';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import SidebarList from '@/layout/components/SidebarList';
import SidebarPins from '@/layout/components/SidebarPins';
import SidebarSearch from '@/layout/components/SidebarSearch';
import { menuRoutes } from '@/routes';
import SearchFiltersToggle from '@/toggle/SearchFiltersToggle';
import SettingsToggle from '@/toggle/SettingsToggle';
import SortSectionsToggle from '@/toggle/SortSectionsToggle';
import {
  Box
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

export default function SidebarDrawer() {
  const location = useLocation();
  const { sidebarTerm, sidebarSearchOpen } = useSettingsStoreSelector((state) => state);

  return (
    <GenericPanel id="sidebar" toolbar={<>
      <SidebarSearch />
      {!sidebarSearchOpen && <GroupToolbarItems>
        <SortSectionsToggle />
        <SettingsToggle />
        <SearchFiltersToggle />
      </GroupToolbarItems>}
    </>}>
      {sidebarTerm === '' && menuRoutes.map((item) => <Box component={NavLink} to={item.path} key={item.path}>
        <SidebarCoreButton title={item.title} icon={routeIcons[item.path]} isActive={location.pathname === item.path} noCounts={true}  />
      </Box>)}

      <SidebarPins />
      <SidebarList />
    </GenericPanel>
  )
}
