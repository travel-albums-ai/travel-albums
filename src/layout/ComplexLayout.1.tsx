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
  label: string,
  component: string,
  drawerKey: string
) => [{ type: 'tab', name: i18n.t(label), component, enabled: drawerKey }];

const STORAGE_KEY = 'flexlayout-model-v1';

function cleanModel(model: IJsonModel, drawers: typeof drawers): IJsonModel {
  const result = { ...model };

  const resultDrawers = {
    global: result.global,
    borders: result?.borders?.map(border => ({
      ...border,
      children: border?.children?.filter(child => drawers[child.enabled])
    })),
    layout: {
      ...result.layout,
      children: result?.layout?.children?.map(tabset => ({
        ...tabset,
        children: tabset?.children?.filter(child => drawers[child.enabled])
      })),
    },
  };

  return resultDrawers as IJsonModel;
}

function createDefaultJson(drawers: typeof drawers, locale: string): IJsonModel {
  console.log('createDefaultJson', drawers, locale);
  const result = {
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
          ...tab('drawerExplorer', 'sidebarDrawer', 'sidebar'),
          ...tab('drawerFiles', 'filesDrawer', 'files'),
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          ...tab('drawerPreview', 'previewDrawer', 'preview'),
          ...tab('drawerAdjustments', 'adjustmentsDrawer', 'adjustments'),
          ...tab('drawerLabeler', 'labelerDrawer', 'labeler'),
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
            ...tab('drawerMain', 'outletDrawer', 'outlet'),
            ...tab('drawerGlobe', 'globeDrawer', 'globe'),
            ...tab('drawerScroller', 'scrollerDrawer', 'scroller'),
            ...tab('drawerRows', 'rowsDrawer', 'rows'),
            ...tab('drawerCalendar', 'calendarDrawer', 'calendar'),
            ...tab('drawerFolderHandlers', 'folderHandlersDrawer', 'folderHandler'),
          ],
        },
      ],
    },
  }

  return cleanModel(result as IJsonModel, drawers) as IJsonModel;
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

function loadModel(drawers: typeof drawers, locale: string) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      return Model.fromJson(cleanModel(parsed as IJsonModel, drawers));
    }
  } catch (e) {
    console.warn('Failed to restore layout', e);
  }

  return Model.fromJson(createDefaultJson(drawers, locale));
}

export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);
  const locale = useSettingsStoreSelector((s) => s.locale);
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);

  const [model, setModel] = useState(() => loadModel(drawers, locale));

  const factory = useCallback((node: TabNode) => {
    const Component = COMPONENTS[node.getComponent() as keyof typeof COMPONENTS];
    return Component ? <Component /> : null;
  }, []);

  useEffect(() => {
    setModel(loadModel(drawers, locale));
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
