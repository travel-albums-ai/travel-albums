import GenericPanel from '@/components/generics/GenericPanel';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { routeIcons } from '@/icons/IconsIndex';
import SidebarCoreButton from '@/layout/components/SidebarCoreButton';
import SidebarList from '@/layout/components/SidebarList';
import SidebarPins from '@/layout/components/SidebarPins';
import { menuRoutes } from '@/routes';
import {
  Box
} from '@mui/material';
import { NavLink, useLocation } from 'react-router-dom';



export default function SidebarDrawer() {
  const location = useLocation();
  const { sidebarTerm, sidebarSearchOpen } = useSettingsStoreSelector((state) => state);

  // useRegisterTool(
  //   {
  //     name: 'toggle_settings_section',
  //     description:
  //       'Toggle the active settings section.',
  //     inputSchema: {
  //       type: 'object',
  //       properties: {
  //         mode: {
  //           type: 'string',
  //           enum: ['layout', 'indexer', 'sections', 'demo', 'tags'],
  //           description: 'Settings section to switch to.',
  //         },
  //       },
  //     },
  //     execute: async ({ mode }: { mode: 'layout' | 'indexer' | 'sections' | 'demo' | 'tags' }) => {
  //       setSetting((prev) => ({
  //         ...prev,
  //         activeSettingsTab: mode,
  //       }));

  //       return {
  //         content: [
  //           {
  //             type: 'text',
  //             text: `Settings section switched to ${mode}.`,
  //           },
  //         ],
  //       };
  //     },
  //   },
  //   [activeSettingsTab, setSetting]
  // );



  return <>
    {/* <WebMCPDataRun
      name="trigger_sidebar_all_photos"
      description="Toggle the sidebar to show all photos"
      execute={async ({ mode }: { mode?: 'light' | 'dark' }) => {
        navigate('/photos');

        return { themeMode: mode === 'light' ? 'dark' : 'light' };
      }}
    /> */}



    <GenericPanel id="sidebar" defaultToolbar toolbarContext={{ sidebarSearchOpen }}>
      {sidebarTerm === '' && menuRoutes.map((item) => <Box component={NavLink} to={item.path} key={item.path}>
        <SidebarCoreButton title={item.title} icon={routeIcons[item.path]} isActive={location.pathname === item.path} noCounts={true}  />
      </Box>)}
      <SidebarPins />
      <SidebarList />
    </GenericPanel>
  </>
}
