import { loadGlobEntries } from '@/discovery/globLoader';
import { ToolMeta, toolRegistry } from '@/toolRegistry';

const modules = import.meta.glob<ToolMeta | undefined>(['./middleware/tools/**/*.meta.ts', './middleware/base/**/*.meta.ts'], {
  import: 'meta',
});

let discoveryPromise: Promise<ToolMeta[]> | null = null;

function isToolSide(value: unknown): value is 'left' | 'right' {
  return value === 'left' || value === 'right';
}

function isValidToolMeta(path: string, meta: ToolMeta) {
  if (typeof meta.id !== 'string' || meta.id.length === 0) {
    console.warn(`${path} has invalid tool meta id`);
    return false;
  }

  if (typeof meta.loader !== 'function') {
    console.warn(`${path} has invalid tool meta loader`);
    return false;
  }

  if (!Array.isArray(meta.tool)) {
    console.warn(`${path} has invalid tool entries`);
    return false;
  }

  for (const entry of meta.tool) {
    if (typeof entry.id !== 'string' || entry.id.length === 0) {
      console.warn(`${path} has tool entry with invalid group id`);
      return false;
    }

    if (!isToolSide(entry.side)) {
      console.warn(`${path} has tool entry with invalid side`);
      return false;
    }

    if (entry.priority !== undefined && typeof entry.priority !== 'number') {
      console.warn(`${path} has tool entry with invalid priority`);
      return false;
    }

    if (entry.visible !== undefined && typeof entry.visible !== 'function') {
      console.warn(`${path} has tool entry with invalid visible predicate`);
      return false;
    }
  }

  return true;
}

async function loadToolMetadata() {
  const items = await loadGlobEntries<ToolMeta | undefined>(modules);

  const metas: ToolMeta[] = [];

  for (const item of items) {
    const { path, value: meta, error } = item as { path: string; value?: ToolMeta; error?: any };

    if (error) {
      console.warn('Failed to load module during discovery', error);
      continue;
    }

    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (!isValidToolMeta(path, meta)) {
      continue;
    }

    if (meta.enabled === false) {
      console.warn(`${path} is disabled`);
      continue;
    }

    toolRegistry.register(meta);
    metas.push(meta);
  }

  // Warm component preloads asynchronously to reduce first-render latency.
  void toolRegistry.preloadAll(metas).catch((err) => {
    console.warn('Tool component warm preload failed', err);
  });

  return metas;
}

export function ensureToolDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadToolMetadata().catch((error) => {
    // Allow subsequent calls to retry when discovery or preload fails.
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}

export async function ensureToolGroupPreload(group: string) {
  await ensureToolDiscovery();
  const metas = toolRegistry.tool(group);
  await toolRegistry.preloadAll(metas);
}
