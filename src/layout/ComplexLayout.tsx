import { useSettingsStoreSelector } from '@/context/settingsStore';
import { ensureDrawerDiscovery } from '@/drawerDiscovery';
import { drawerRegistry } from '@/drawerRegistry';
import MainDriver from '@/drivers/MainDriver';
import GeneralRegistryToolbar from '@/layout/components/GeneralRegistryToolbar';
import StatusBar from '@/layout/StatusBar';
import NoServerWindow from '@/windows/NoServerWindow';
import OnboardingWindow from '@/windows/OnboardingWindow';
import { Box, Theme } from '@mui/material';
import {
  IJsonModel,
  Layout,
  Model,
  TabNode,
} from 'flexlayout-react';
import 'flexlayout-react/style/combined.css';

import WebMCPDataView from '@/components/WebMCPDataView';
import GeneralRegistryDrawer from '@/layout/components/GeneralRegistryDrawer';
import i18n from '@/lib/i18n';
import SettingsWindow from '@/windows/SettingsWindow';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

const tab = (
  label: string,
  component: string,
) => [{ type: 'tab', name: i18n.t(label), component }]

const STORAGE_KEY = 'flexlayout-model-v1';

const leftChildren = [
  ...tab('drawerExplorer', 'sidebar'),
  ...tab('drawerFiles', 'files'),
]

const rightChildren = [
  ...tab('drawerPreview', 'preview'),
  ...tab('drawerAdjustments', 'adjustments'),
  ...tab('drawerAutoDescription', 'autoDescription'),
]

const layoutChildren = [
  ...tab('drawerMain', 'outlet'),
  ...tab('drawerGlobe', 'globe'),
  ...tab('drawerScroller', 'scroller'),
  ...tab('drawerRows', 'rows'),
  ...tab('drawerCalendar', 'calendar'),

]

function createDefaultJson(): IJsonModel {
  return {
    global: {
      tabEnableClose: false,
      tabEnableRenderOnDemand: true,
    },
    borders: [
      {
        type: 'border',
        location: 'left',
        selected: 0,
        size: 400,
        minSize: 350,
        children: leftChildren,
      },
      {
        type: 'border',
        location: 'right',
        size: 550,
        minSize: 550,
        children: rightChildren,
      },
    ],
    layout: {
      type: 'row',
      weight: 100,
      children: [
        {
          type: 'tabset',
          weight: 50,
          children: layoutChildren,
        },
      ],
    },
  };
}

function loadModel(drawers: typeof drawers) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      return Model.fromJson(cleanModel(JSON.parse(saved), drawers));
    }
  } catch (e) {
    console.warn('Failed to restore layout', e);
  }

  return Model.fromJson(cleanModel(createDefaultJson(), drawers));
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
  const settingsStore = useSettingsStoreSelector((state) => state);

  const [drawerDiscoveryReady, setDrawerDiscoveryReady] = useState(false);

  useEffect(() => {
    ensureDrawerDiscovery().then(() => setDrawerDiscoveryReady(true));
  }, []);

  const factory = useCallback((node: TabNode) => {
    const component = node.getComponent();
    return drawerRegistry.has(component) ? <GeneralRegistryDrawer id={component} /> : null;
  }, []);

  const model = useMemo(
    () => drawerDiscoveryReady ? loadModel(drawers) : null,
    [drawers, drawerDiscoveryReady],
  );

  if (!model) {
    return null;
  }

  return (
    <>
      <GeneralRegistryToolbar group="header" sx={{
        px: 1,
        pt: 0.75,
        pb: 0.75,
        bgcolor: 'background.default',
        borderBottom: (theme: Theme) => `1px solid ${theme.palette.divider}`
      }} />
      <NoServerWindow />
      <OnboardingWindow />
      <SettingsWindow />
      <MainDriver />

      <WebMCPDataView
        name="check_settings_store"
        description="Get current settings store"
        execute={async () => ({
          content: [{
            type: 'text',
            text: `Current settings store is ${JSON.stringify(settingsStore)}.`
          }]
        })}
      />

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
