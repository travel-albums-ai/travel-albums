import { ThemeMeta, themeRegistry } from '@/themeRegistry';

const modules = import.meta.glob<Record<string, any>>(['./themes/**/*.theme.ts', './themes/*.theme.ts']);

let discoveryPromise: Promise<ThemeMeta[]> | null = null;

function basenameFromPath(path: string) {
  const parts = path.split('/');
  const file = parts[parts.length - 1];
  return file.replace(/\.theme\.ts$/, '');
}

async function loadThemeModules() {
  const entries = Object.entries(modules);

  const settled = await Promise.allSettled(
    entries.map(([path, loader]) =>
      loader()
        .then((mod) => ({ path, mod }))
        .catch((error) => ({ path, mod: undefined, error }))
    ),
  );

  const metas: ThemeMeta[] = [];

  for (const item of settled) {
    if (item.status === 'rejected') {
      console.warn('Failed to load theme module during discovery', item.reason);
      continue;
    }

    const { path, mod, error } = item.value as { path: string; mod?: Record<string, any>; error?: any };

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

export function warmThemeDiscovery() {
  void ensureThemeDiscovery().catch((error) => {
    console.warn('Theme discovery warmup failed', error);
  });
}
