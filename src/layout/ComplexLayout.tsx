import { useSettingsStoreSelector } from '@/context/settingsStore';
import AdjustmentsDrawer from '@/drawers/AdjustmentsDrawer';
import CalendarDrawer from '@/drawers/CalendarDrawer';
import FilesDrawer from '@/drawers/FilesDrawer';
import FolderHandlersDrawer from '@/drawers/FolderHandlersDrawer';
import GlobeDrawer from '@/drawers/GlobeDrawer';
import LabelerDrawer from '@/drawers/LabelerDrawer';
import OutletDrawer from '@/drawers/OutletDrawer';
import PhotoDrawer from '@/drawers/PhotoDrawer';
import RowsDrawer from '@/drawers/RowsDrawer';
import ScrollerDrawer from '@/drawers/ScrollerDrawer';
import SidebarDrawer from '@/drawers/SidebarDrawer';
import MainDriver from '@/drivers/MainDriver';
import GeneralToolbar from '@/layout/components/GeneralToolbar';
import StatusBar from '@/layout/StatusBar';
import NoServerModal from '@/modals/NoServerModal';
import OnboardingModal from '@/modals/OnboardingModal';
import { Box, Theme } from '@mui/material';
import {
  IJsonModel,
  Layout,
  Model,
  TabNode,
} from 'flexlayout-react';
import 'flexlayout-react/style/combined.css';

import i18n from '@/lib/i18n';
import {
  useCallback,
  useEffect,
  useState
} from 'react';

const tab = (
  enabled: boolean,
  label: string,
  component: string,
) => (enabled ? [{ type: 'tab', name: i18n.t(label), component }] : []);

const STORAGE_KEY = 'flexlayout-model-v1';

function createDefaultJson(drawers: typeof drawers, locale: string): IJsonModel {
  console.log('createDefaultJson', drawers, locale);
  return {
    global: {
      tabEnableClose: false,
    },
    borders: [
      {
        type: 'border',
        location: 'left',
        selected: 0,
        size: 400,
        minSize: 350,
        children: [
          ...tab(drawers.sidebar, 'drawerExplorer', 'sidebarDrawer'),
          ...tab(drawers.files, 'drawerFiles', 'filesDrawer'),
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          ...tab(drawers.preview, 'drawerPreview', 'previewDrawer'),
          ...tab(drawers.adjustments, 'drawerAdjustments', 'adjustmentsDrawer'),
          ...tab(drawers.labeler, 'drawerLabeler', 'labelerDrawer'),
        ],
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 50,
          children: [
            ...tab(drawers.outlet, 'drawerMain', 'outletDrawer'),
            ...tab(drawers.globe, 'drawerGlobe', 'globeDrawer'),
            ...tab(drawers.scroller, 'drawerScroller', 'scrollerDrawer'),
            ...tab(drawers.rows, 'drawerRows', 'rowsDrawer'),
            ...tab(drawers.calendar, 'drawerCalendar', 'calendarDrawer'),
            ...tab(drawers.folderHandler, 'drawerFolderHandlers', 'folderHandlersDrawer'),
          ],
        },
      ],
    },
  };
}

const COMPONENTS = {
  sidebarDrawer: SidebarDrawer,
  globeDrawer: GlobeDrawer,
  outletDrawer: OutletDrawer,
  previewDrawer: PhotoDrawer,
  adjustmentsDrawer: AdjustmentsDrawer,
  filesDrawer: FilesDrawer,
  labelerDrawer: LabelerDrawer,
  scrollerDrawer: ScrollerDrawer,
  rowsDrawer: RowsDrawer,
  calendarDrawer: CalendarDrawer,
  folderHandlersDrawer: FolderHandlersDrawer,
} as const;

function loadModel(drawers: typeof drawers) {
  try {
    const saved = false

    if (saved) {
      return Model.fromJson(JSON.parse(saved));
    }
  } catch (e) {
    console.warn('Failed to restore layout', e);
  }

  return Model.fromJson(createDefaultJson(drawers, i18n.language));
}

export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);
  const locale = useSettingsStoreSelector((state) => state.locale);
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);

  const [model, setModel] = useState(() => loadModel(drawers));

  const factory = useCallback((node: TabNode) => {
    const Component = COMPONENTS[node.getComponent() as keyof typeof COMPONENTS];
    return Component ? <Component /> : null;
  }, []);

  useEffect(() => {
    setModel(loadModel(drawers));
  }, [drawers, locale]);

  return (
    <>
      <GeneralToolbar group="header" sx={{
        px: 1,
        pt: 0.75,
        pb: 0.75,
        bgcolor: 'background.default',
        borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`
      }} />
      <NoServerModal />
      <OnboardingModal />
      <MainDriver />

      <Box
        className={themeMode === 'dark' ? 'flexlayout__theme_alpha_dark' : 'flexlayout__theme_light'}
        sx={{
          flexGrow: 1,
          mx: 0.5,
          position: 'relative',
        }}
      >
        <Layout
          model={model}
          factory={factory}
          onModelChange={(newModel) => localStorage.setItem(STORAGE_KEY, JSON.stringify(newModel.toJson()))}
        />
      </Box>

      <StatusBar />
    </>
  );
}
