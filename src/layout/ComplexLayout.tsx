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

import * as FlexLayout from 'flexlayout-react';

console.log(FlexLayout);

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
) => [{ type: 'tab', name: i18n.t(label), component }]

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
          ...tab(drawers.sidebar, 'drawerExplorer', 'sidebar'),
          ...tab(drawers.files, 'drawerFiles', 'files'),
        ],
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: [
          ...tab(drawers.preview, 'drawerPreview', 'preview'),
          ...tab(drawers.adjustments, 'drawerAdjustments', 'adjustments'),
          ...tab(drawers.labeler, 'drawerLabeler', 'labeler'),
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
            ...tab(drawers.outlet, 'drawerMain', 'outlet'),
            ...tab(drawers.globe, 'drawerGlobe', 'globe'),
            ...tab(drawers.scroller, 'drawerScroller', 'scroller'),
            ...tab(drawers.rows, 'drawerRows', 'rows'),
            ...tab(drawers.calendar, 'drawerCalendar', 'calendar'),
            ...tab(drawers.folderHandler, 'drawerFolderHandlers', 'folderHandler'),
          ],
        },
      ],
    },
  };
}

const COMPONENTS = {
  sidebar: SidebarDrawer,
  globe: GlobeDrawer,
  outlet: OutletDrawer,
  preview: PhotoDrawer,
  adjustments: AdjustmentsDrawer,
  files: FilesDrawer,
  labeler: LabelerDrawer,
  scroller: ScrollerDrawer,
  rows: RowsDrawer,
  calendar: CalendarDrawer,
  folderHandler: FolderHandlersDrawer,
} as const;

function loadModel(drawers: typeof drawers) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return Model.fromJson(cleanModel(JSON.parse(saved), drawers));
    }
  } catch (e) {
    console.warn('Failed to restore layout', e);
  }

  return Model.fromJson(cleanModel(createDefaultJson(drawers, i18n.language), drawers));
}

function cleanModel(model: IJsonModel, drawers: typeof drawers): IJsonModel {
  const result = { ...model };

  const resultDrawers = {
    global: result.global,
    borders: result?.borders?.map(border => ({
      ...border,
      children: border?.children?.filter(child => drawers[child.component as keyof typeof drawers])
    })),
    layout: {
      ...result.layout,
      children: result?.layout?.children?.map(tabset => ({
        ...tabset,
        children: tabset?.children?.filter(child => drawers[child.component as keyof typeof drawers])
      })),
    },
  };

  return resultDrawers as IJsonModel;
}

export default function ComplexLayout() {
  const drawers = useSettingsStoreSelector((s) => s.drawers);
  const themeMode = useSettingsStoreSelector((state) => state.themeMode);

  const [model, setModel] = useState(() => loadModel(drawers));

  const factory = useCallback((node: TabNode) => {
    const Component = COMPONENTS[node.getComponent() as keyof typeof COMPONENTS];
    return Component ? <Component /> : null;
  }, []);

  useEffect(() => {
    setModel(loadModel(drawers));
  }, [drawers]);

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
