import { ToolMeta, toolRegistry } from '@/toolRegistry';

const modules = import.meta.glob<ToolMeta | undefined>('./tools/**/*.meta.ts', {
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
  const loaded = await Promise.all(
    Object.entries(modules).map(async ([path, loadMeta]) => ({
      path,
      meta: await loadMeta(),
    })),
  );

  const metas: ToolMeta[] = [];

  for (const { path, meta } of loaded) {
    if (!meta) {
      console.warn(`${path} does not export 'meta'`);
      continue;
    }

    if (!isValidToolMeta(path, meta)) {
      continue;
    }

    if(meta.enabled === false) {
      console.warn(`${path} is disabled`);
      continue;
    }

    toolRegistry.register(meta);
    metas.push(meta);
  }

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

export function warmToolDiscovery() {
  void ensureToolDiscovery().catch((error) => {
    console.warn('Tool discovery warmup failed', error);
  });
}

export async function ensureToolGroupPreload(group: string) {
  await ensureToolDiscovery();
  const metas = toolRegistry.tool(group);
  await toolRegistry.preloadAll(metas);
}

export function warmToolGroup(group: string) {
  void ensureToolGroupPreload(group).catch((error) => {
    console.warn(`Tool group warmup failed for '${group}'`, error);
  });
}
