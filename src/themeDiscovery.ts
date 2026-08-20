import { loadGlobEntries } from '@/discovery/globLoader';
import { ThemeMeta, themeRegistry } from '@/themeRegistry';

const modules = import.meta.glob<Record<string, any>>(['./themes/**/*.theme.ts', './themes/*.theme.ts']);

let discoveryPromise: Promise<ThemeMeta[]> | null = null;

function basenameFromPath(path: string) {
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  return file.replace(/\.theme\.ts$/, '');
}

async function loadThemeModules() {
  const items = await loadGlobEntries<Record<string, any>>(modules);

  const metas: ThemeMeta[] = [];

  for (const item of items) {
    const { path, value: mod, error } = item as { path: string; value?: Record<string, any>; error?: any };

    if (error) {
      console.warn(`${path} failed to load theme:`, error);
      continue;
    }

    if (!mod) {
      console.warn(`${path} did not export a theme`);
      continue;
    }

    // Derive a human-friendly name from common exports or filename
    const name = mod?.default?.name ?? mod?.name ?? mod?.themeName ?? basenameFromPath(path);

    const id = String(name).replace(/\s+/g, '-').toLowerCase();

    // register the meta and attach the loaded module for synchronous access
    const meta: ThemeMeta = {
      id,
      name,
      loader: () => Promise.resolve(mod),
      path,
      module: mod,
    };

    themeRegistry.register(meta);
    metas.push(meta);
  }

  return metas;
}

export function ensureThemeDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadThemeModules().catch((error) => {
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}
