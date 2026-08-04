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
  useRef,
  useState
} from 'react';

const LAYOUT_STORAGE_KEY = 'travel-layers:layout-model';

function createDefaultJson(drawers: typeof drawers): IJsonModel {
  console.log('createDefaultJson', drawers);
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
    return Model.fromJson(saved ? JSON.parse(saved) : createDefaultJson(drawers)
    );
  } catch (e) {
    console.warn(i18n.t('failedLoadingLayout'), e);
    return Model.fromJson(createDefaultJson(drawers));
  }
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

const DRAWER_LABELS = {
  sidebarDrawer: 'drawerExplorer',
  filesDrawer: 'drawerFiles',
  previewDrawer: 'drawerPreview',
  adjustmentsDrawer: 'drawerAdjustments',
  labelerDrawer: 'drawerLabeler',
  outletDrawer: 'drawerMain',
  globeDrawer: 'drawerGlobe',
  scrollerDrawer: 'drawerScroller',
  rowsDrawer: 'drawerRows',
  calendarDrawer: 'drawerCalendar',
  folderHandlersDrawer: 'drawerFolderHandlers',
} as const;

export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);

  const [model, setModel] = useState(() => loadModel(drawers));
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const locale = useSettingsStoreSelector((state) => state.locale);

  const factory = useCallback((node: TabNode) => {
    const Component = COMPONENTS[node.getComponent() as keyof typeof COMPONENTS];
    return Component ? <Component /> : null;
  }, []);

  const timeout = useRef<number>();
  const modelRef = useRef<Model | null>(null);

  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  useEffect(() => {
    setModel(loadModel(drawers));
  }, [drawers]);

  // When locale changes, update tab names in the current layout JSON
  useEffect(() => {
    try {
      const curModel = modelRef.current ?? loadModel(drawers);
      const json = curModel.toJson();

      const compKey = DRAWER_LABELS;

      function walk(node: any) {
        if (!node || typeof node !== 'object') return;
        if (Array.isArray(node)) {
          node.forEach(walk);
          return;
        }

        if (node.type === 'tab' && node.component && compKey[node.component as keyof typeof compKey]) {
          node.name = i18n.t(compKey[node.component as keyof typeof compKey]);
        }

        for (const k of Object.keys(node)) {
          walk(node[k]);
        }
      }

      walk(json);

      const newModel = Model.fromJson(json as IJsonModel);
      setModel(newModel);

      try {
        localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(json));
      } catch (e) {
        console.warn(i18n.t('failedSavingLayout'), e);
      }
    } catch (e) {
      console.warn(i18n.t('failedLoadingLayout'), e);
    }
  }, [locale, drawers]);


  const handleModelChange = useCallback((model: Model) => {
    localStorage.setItem(
      LAYOUT_STORAGE_KEY,
      JSON.stringify(model.toJson())
    );
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
