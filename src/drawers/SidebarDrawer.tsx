import GenericPanel from '@/components/generics/GenericPanel';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import SidebarCoreButton from '@/drawers/sidebar/SidebarCoreButton';
import SidebarList from '@/drawers/sidebar/SidebarList';
import SidebarPins from '@/drawers/sidebar/SidebarPins';
import { routeIcons } from '@/icons/IconsIndex';
import { menuRoutes } from '@/routes';
import {
  Box
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';

export default function SidebarDrawer() {
  const location = useLocation();
  const { sidebarTerm, sidebarSearchOpen } = useSettingsStoreSelector((state) => state);
  return <>
    <GenericPanel id="sidebar" defaultTool toolContext={{ sidebarSearchOpen }}>
      {sidebarTerm === '' && menuRoutes.map((item) => <Box component={NavLink} to={item.path} key={item.path}>
        <SidebarCoreButton title={item.title} icon={routeIcons[item.path]} isActive={location.pathname === item.path} noCounts={true}  />
      </Box>)}
      <SidebarPins />
      <SidebarList />
    </GenericPanel>
  </>
}
