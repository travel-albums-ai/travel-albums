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

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import i18n from '@/lib/i18n';

const LAYOUT_STORAGE_KEY = 'travel-layers:layout-model';
const SAVE_DELAY = 300;

function createDefaultJson(drawers: typeof drawers): IJsonModel {
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
          ...(drawers.sidebar ? [{ type: 'tab', name: i18n.t('drawerExplorer'), component: 'sidebarDrawer' }] : []),
          ...(drawers.files ? [{ type: 'tab', name: i18n.t('drawerFiles'), component: 'filesDrawer' }] : []),
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          ...(drawers.preview ? [{ type: 'tab', name: i18n.t('drawerPreview'), component: 'previewDrawer' }] : []),
          ...(drawers.adjustments ? [{ type: 'tab', name: i18n.t('drawerAdjustments'), component: 'adjustmentsDrawer' }] : []),
          ...(drawers.labeler ? [{ type: 'tab', name: i18n.t('drawerLabeler'), component: 'labelerDrawer' }] : []),
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
            ...(drawers.outlet ? [{ type: 'tab', name: i18n.t('drawerMain'), component: 'outletDrawer' }] : []),
            ...(drawers.globe ? [{ type: 'tab', name: i18n.t('drawerGlobe'), component: 'globeDrawer' }] : []),
            ...(drawers.scroller ? [{ type: 'tab', name: i18n.t('drawerScroller'), component: 'scrollerDrawer' }] : []),
            ...(drawers.rows ? [{ type: 'tab', name: i18n.t('drawerRows'), component: 'rowsDrawer' }] : []),
            ...(drawers.calendar ? [{ type: 'tab', name: i18n.t('drawerCalendar'), component: 'calendarDrawer' }] : []),
            ...(drawers.folderHandler ? [{ type: 'tab', name: i18n.t('drawerFolderHandlers'), component: 'folderHandlersDrawer' }] : []),
          ],
        },
      ],
    },
  };
}

function loadModel(drawers: typeof drawers) {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);

    if (!saved) {
      return Model.fromJson(createDefaultJson(drawers));
    }

    return Model.fromJson(JSON.parse(saved));
  } catch (e) {
    console.warn(i18n.t('failedLoadingLayout'), e);
    return Model.fromJson(createDefaultJson(drawers));
  }
}

export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);

  const [model, setModel] = useState(() => loadModel(drawers));
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);

  const sidebar = useMemo(() => <SidebarDrawer />, []);
  const globe = useMemo(() => <GlobeDrawer />, []);
  const outlet = useMemo(() => <OutletDrawer />, []);
  const preview = useMemo(() => <PhotoDrawer />, []);
  const adjustments = useMemo(() => <AdjustmentsDrawer />, []);
  const files = useMemo(() => <FilesDrawer />, []);
  const labeler = useMemo(() => <LabelerDrawer />, []);
  const scroller = useMemo(() => <ScrollerDrawer />, []);
  const rows = useMemo(() => <RowsDrawer />, []);
  const calendar = useMemo(() => <CalendarDrawer />, []);
  const folderHandler = useMemo(() => <FolderHandlersDrawer />, []);

  const factory = useCallback((node: TabNode) => {
    switch (node.getComponent()) {
      case "sidebarDrawer":
        return sidebar;
      case "globeDrawer":
        return globe;
      case "outletDrawer":
        return outlet;
      case "previewDrawer":
        return preview;
      case "adjustmentsDrawer":
        return adjustments;
      case "filesDrawer":
        return files;
      case "labelerDrawer":
        return labeler;
      case "scrollerDrawer":
        return scroller;
      case "rowsDrawer":
        return rows;
      case "calendarDrawer":
        return calendar;
      case "folderHandlersDrawer":
        return folderHandler;
      default:
        return null;
    }
  }, [sidebar, globe, outlet, preview, adjustments, files, labeler, scroller, rows, calendar, folderHandler]);

  const timeout = useRef<number>();

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    setModel(loadModel(drawers));
  }, [drawers]);


  const handleModelChange = useCallback((model: Model) => {
    if (timeout.current) {
      clearTimeout(timeout.current);
    }

    timeout.current = window.setTimeout(() => {
      const save = () => {
        try {
          localStorage.setItem(
            LAYOUT_STORAGE_KEY,
            JSON.stringify(model.toJson()),
          );
        } catch (e) {
          console.warn(i18n.t('failedSavingLayout'), e);
        }
      };

      if ('requestIdleCallback' in window) {
        requestIdleCallback(save);
      } else {
        setTimeout(save, 0);
      }
    }, SAVE_DELAY);
  }, []);

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
          onModelChange={handleModelChange}
        />
      </Box>

      <StatusBar />
    </>
  );
}
