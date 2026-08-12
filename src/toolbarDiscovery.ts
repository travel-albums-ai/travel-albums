import { ToolbarMeta, toolbarRegistry } from '@/toolbarRegistry';

const modules = import.meta.glob<ToolbarMeta | undefined>('./toggle/**/*.meta.ts', {
  import: 'meta',
});

let discoveryPromise: Promise<ToolbarMeta[]> | null = null;

function isToolbarSide(value: unknown): value is 'left' | 'right' {
  return value === 'left' || value === 'right';
}

function isValidToolbarMeta(path: string, meta: ToolbarMeta) {
  if (typeof meta.id !== 'string' || meta.id.length === 0) {
    console.warn(`${path} has invalid toolbar meta id`);
    return false;
  }

  if (typeof meta.loader !== 'function') {
    console.warn(`${path} has invalid toolbar meta loader`);
    return false;
  }

  if (!Array.isArray(meta.toolbar)) {
    console.warn(`${path} has invalid toolbar entries`);
    return false;
  }

  for (const entry of meta.toolbar) {
    if (typeof entry.id !== 'string' || entry.id.length === 0) {
      console.warn(`${path} has toolbar entry with invalid group id`);
      return false;
    }

    if (!isToolbarSide(entry.side)) {
      console.warn(`${path} has toolbar entry with invalid side`);
      return false;
    }

    if (entry.priority !== undefined && typeof entry.priority !== 'number') {
      console.warn(`${path} has toolbar entry with invalid priority`);
      return false;
    }

    if (entry.visible !== undefined && typeof entry.visible !== 'function') {
      console.warn(`${path} has toolbar entry with invalid visible predicate`);
      return false;
    }
  }

  return true;
}

async function loadToolbarMetadata() {
  const loaded = await Promise.all(
    Object.entries(modules).map(async ([path, loadMeta]) => ({
      path,
      meta: await loadMeta(),
    })),
  );

  const metas: ToolbarMeta[] = [];

  for (const { path, meta } of loaded) {
    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (!isValidToolbarMeta(path, meta)) {
      continue;
    }

    if(meta.enabled === false) {
      console.warn(`${path} is disabled`);
      continue;
    }

    toolbarRegistry.register(meta);
    metas.push(meta);
  }

  return metas;
}

export function ensureToolbarDiscovery() {
  if (discoveryPromise) {
    return discoveryPromise;
  }

  discoveryPromise = loadToolbarMetadata().catch((error) => {
    // Allow subsequent calls to retry when discovery or preload fails.
    discoveryPromise = null;
    throw error;
  });

  return discoveryPromise;
}

export function warmToolbarDiscovery() {
  void ensureToolbarDiscovery().catch((error) => {
    console.warn('Toolbar discovery warmup failed', error);
  });
}

export async function ensureToolbarGroupPreload(group: string) {
  await ensureToolbarDiscovery();
  const metas = toolbarRegistry.toolbar(group);
  await toolbarRegistry.preloadAll(metas);
}

export function warmToolbarGroup(group: string) {
  void ensureToolbarGroupPreload(group).catch((error) => {
    console.warn(`Toolbar group warmup failed for '${group}'`, error);
  });
}
