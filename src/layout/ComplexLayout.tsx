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
  Actions,
  IJsonModel,
  Layout,
  Model,
  TabNode,
} from 'flexlayout-react';
import 'flexlayout-react/style/combined.css';

import i18n from '@/lib/i18n';
import { ComponentType, useCallback, useEffect, useRef, useState } from 'react';

const LAYOUT_STORAGE_KEY = 'travel-layers:layout-model';
const SAVE_DELAY = 300;

type DrawerLocation = 'left-border' | 'right-border' | 'main';

interface DrawerConfig {
  key: string; // key on the settings store's `drawers` visibility map
  component: string; // flexlayout component id
  i18nKey: string;
  location: DrawerLocation;
  Component: ComponentType;
}

const DRAWER_CONFIGS = [
  { key: 'sidebar', component: 'sidebarDrawer', i18nKey: 'drawerExplorer', location: 'left-border', Component: SidebarDrawer },
  { key: 'files', component: 'filesDrawer', i18nKey: 'drawerFiles', location: 'left-border', Component: FilesDrawer },
  { key: 'preview', component: 'previewDrawer', i18nKey: 'drawerPreview', location: 'right-border', Component: PhotoDrawer },
  { key: 'adjustments', component: 'adjustmentsDrawer', i18nKey: 'drawerAdjustments', location: 'right-border', Component: AdjustmentsDrawer },
  { key: 'labeler', component: 'labelerDrawer', i18nKey: 'drawerLabeler', location: 'right-border', Component: LabelerDrawer },
  { key: 'outlet', component: 'outletDrawer', i18nKey: 'drawerMain', location: 'main', Component: OutletDrawer },
  { key: 'globe', component: 'globeDrawer', i18nKey: 'drawerGlobe', location: 'main', Component: GlobeDrawer },
  { key: 'scroller', component: 'scrollerDrawer', i18nKey: 'drawerScroller', location: 'main', Component: ScrollerDrawer },
  { key: 'rows', component: 'rowsDrawer', i18nKey: 'drawerRows', location: 'main', Component: RowsDrawer },
  { key: 'calendar', component: 'calendarDrawer', i18nKey: 'drawerCalendar', location: 'main', Component: CalendarDrawer },
  { key: 'folderHandler', component: 'folderHandlersDrawer', i18nKey: 'drawerFolderHandlers', location: 'main', Component: FolderHandlersDrawer },
] as const satisfies readonly DrawerConfig[];

type DrawerKey = (typeof DRAWER_CONFIGS)[number]['key'];
type DrawerVisibility = Record<DrawerKey, boolean>;

const DRAWER_COMPONENTS: Record<string, ComponentType> = Object.fromEntries(
  DRAWER_CONFIGS.map((c) => [c.component, c.Component]),
);
const COMPONENT_TO_I18N_KEY: Record<string, string> = Object.fromEntries(
  DRAWER_CONFIGS.map((c) => [c.component, c.i18nKey]),
);

function buildTabs(location: DrawerLocation, visibility: DrawerVisibility) {
  return DRAWER_CONFIGS.filter(
    (c) => c.location === location && visibility[c.key as DrawerKey],
  ).map((c) => ({
    type: 'tab' as const,
    name: i18n.t(c.i18nKey),
    component: c.component,
  }));
}

function createDefaultJson(visibility: DrawerVisibility): IJsonModel {
  return {
    global: { tabEnableClose: false },
    borders: [
      {
        type: 'border',
        location: 'left',
        selected: 0,
        size: 400,
        minSize: 350,
        children: buildTabs('left-border', visibility),
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: buildTabs('right-border', visibility),
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        { type: 'tabset', weight: 50, children: buildTabs('main', visibility) },
      ],
    },
  };
}

function loadModel(visibility: DrawerVisibility): Model {
  try {
    const saved = localStorage.getItem(LAYOUT_STORAGE_KEY);
    if (saved) {
      return Model.fromJson(JSON.parse(saved));
    }
  } catch (e) {
    console.warn(i18n.t('failedLoadingLayout'), e);
  }
  return Model.fromJson(createDefaultJson(visibility));
}

function persistModel(model: Model) {
  try {
    localStorage.setItem(LAYOUT_STORAGE_KEY, JSON.stringify(model.toJson()));
  } catch (e) {
    console.warn(i18n.t('failedSavingLayout'), e);
  }
}


export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers) as DrawerVisibility;
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);
  const locale = useSettingsStoreSelector((state) => state.locale);

  const [model, setModel] = useState(() => loadModel(drawers));
  const modelRef = useRef<Model | null>(null);
  const saveTimeoutRef = useRef<number>();
  const appliedLangRef = useRef<string | null>(null);

  useEffect(() => {
    modelRef.current = model;
  }, [model]);

  const schedulePersist = useCallback((m: Model) => {
    if (saveTimeoutRef.current) window.clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = window.setTimeout(() => {
      const run = () => persistModel(m);
      if ('requestIdleCallback' in window) {
        requestIdleCallback(run);
      } else {
        run();
      }
    }, SAVE_DELAY);
  }, []);

  const flushPendingSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = undefined;
    }
    if (modelRef.current) persistModel(modelRef.current);
  }, []);

  useEffect(() => {
    return () => {
      flushPendingSave();
    };
  }, [flushPendingSave]);

  useEffect(() => {
    flushPendingSave();
    setModel(loadModel(drawers));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawers]);

  const relabelDrawers = useCallback((lng?: string) => {
    const resolvedLng = lng ?? i18n.language;
    if (appliedLangRef.current === resolvedLng) return; // dedupe store-locale + i18n event firing together
    appliedLangRef.current = resolvedLng;

    const currentModel = modelRef.current;
    if (!currentModel) return;

    currentModel.visitNodes((node) => {
      if (node.getType() !== 'tab') return;
      const tabNode = node as TabNode;
      const i18nKey = COMPONENT_TO_I18N_KEY[tabNode.getComponent() ?? ''];
      if (!i18nKey) return;
      const nextName = i18n.t(i18nKey, { lng: resolvedLng });
      if (tabNode.getName() !== nextName) {
        currentModel.doAction(Actions.renameTab(tabNode.getId(), nextName));
      }
    });
  }, []);

  useEffect(() => {
    const handler = (lng: string) => relabelDrawers(lng);
    i18n.on?.('languageChanged', handler);
    return () => i18n.off?.('languageChanged', handler);
  }, [relabelDrawers]);

  useEffect(() => {
    relabelDrawers(locale);
  }, [locale, relabelDrawers]);

  const factory = useCallback((node: TabNode) => {
    const Component = DRAWER_COMPONENTS[node.getComponent() ?? ''];
    return Component ? <Component /> : null;
  }, []);

  const handleModelChange = useCallback(
    (m: Model) => schedulePersist(m),
    [schedulePersist],
  );

  return (
    <>
      <GeneralToolbar
        group="header"
        sx={{
          px: 1,
          pt: 0.75,
          pb: 0.75,
          bgcolor: 'background.default',
          borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`,
        }}
      />
      <NoServerModal />
      <OnboardingModal />
      <MainDriver />

      <Box
        className={themeMode === 'dark' ? 'flexlayout__theme_alpha_dark' : 'flexlayout__theme_light'}
        sx={{ flexGrow: 1, mx: 0.5, position: 'relative' }}
      >
        <Layout model={model} factory={factory} onModelChange={handleModelChange} />
      </Box>

      <StatusBar />
    </>
  );
}
