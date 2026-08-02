import { useSettingsStoreSelector } from '@/context/settingsStore';
import AdjustmentsDrawer from '@/drawers/AdjustmentsDrawer';
import CalendarDrawer from '@/drawers/CalendarDrawer';
import FilesDrawer from '@/drawers/FilesDrawer';
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
import { Box } from '@mui/material';
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
          ...(drawers.sidebar ? [{ type: 'tab', name: 'Explorer', component: 'sidebarDrawer' }] : []),
          ...(drawers.files ? [{ type: 'tab', name: 'Files', component: 'filesDrawer' }] : []),
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          ...(drawers.preview ? [{ type: 'tab', name: 'Preview', component: 'previewDrawer' }] : []),
          ...(drawers.adjustments ? [{ type: 'tab', name: 'Adjustments', component: 'adjustmentsDrawer' }] : []),
          ...(drawers.labeler ? [{ type: 'tab', name: 'Labeler', component: 'labelerDrawer' }] : []),
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
            ...(drawers.outlet ? [{ type: 'tab', name: 'Main', component: 'outletDrawer' }] : []),
            ...(drawers.globe ? [{ type: 'tab', name: 'Globe', component: 'globeDrawer' }] : []),
            ...(drawers.scroller ? [{ type: 'tab', name: 'Scroller', component: 'scrollerDrawer' }] : []),
            ...(drawers.rows ? [{ type: 'tab', name: 'Rows', component: 'rowsDrawer' }] : []),
            ...(drawers.calendar ? [{ type: 'tab', name: 'Calendar', component: 'calendarDrawer' }] : []),
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
    console.warn('Failed loading layout', e);
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
      default:
        return null;
    }
  }, [sidebar, globe, outlet, preview, adjustments, files, labeler, scroller, rows, calendar]);

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
          console.warn('Failed saving layout', e);
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
      <GeneralToolbar group="header" />
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
