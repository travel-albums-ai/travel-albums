import express from 'express';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import {
    createCompressionMiddleware,
    filterFilesByAlbum,
    getDirectorySize,
    groupFilesByFolder,
    isTakeoutImageFile,
    listSortedFiles,
    selectRandomThumbnailPreviewFiles,
} from './server-utils/index.mjs';
import {
    cancelJob,
    getConfig,
    getJob,
    listScripts,
    runScriptSync,
    setConfig,
    spawnScript
} from './server-utils/script-runner.mjs';

let thumbnailsRoot = path.resolve(process.cwd(), 'thumbnails');

const app = express();
const port = Number(process.env.PORT ?? 3001);
let takeoutRoot = path.resolve(process.cwd(), 'Takeout');
let takeoutFilesCache = null;
let takeoutFilesLoadPromise = null;

const serverConfigPath = path.resolve(process.cwd(), 'server-config.json');

async function ensureServerConfig() {
  try {
    const raw = await readFile(serverConfigPath, 'utf8');
    const parsed = JSON.parse(raw);
    await setConfig(parsed);
    console.log('Loaded server config from', serverConfigPath, JSON.stringify(parsed));
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      const conf = getConfig();
      await setConfig(conf);
      console.log('No server-config found; wrote default to', serverConfigPath);
    } else {
      console.warn('Failed to load server-config.json:', err?.message ?? String(err));
    }
  }

  // Update in-memory roots from the active config
  const cfg = getConfig();
  thumbnailsRoot = path.resolve(process.cwd(), cfg.TARGET_ROOT ?? cfg.OUTPUT_DIR ?? 'thumbnails');
  takeoutRoot = path.resolve(process.cwd(), cfg.TAKEOUT_ROOT ?? 'Takeout');
}

const loadTakeoutFiles = async () => {
  if (takeoutFilesCache) {
    return takeoutFilesCache;
  }

  // Reuse a single directory scan when concurrent requests arrive.
  if (!takeoutFilesLoadPromise) {
    takeoutFilesLoadPromise = listSortedFiles(takeoutRoot)
      .then((files) => {
        const groupedFiles = groupFilesByFolder(files);
        takeoutFilesCache = {
          root: '/src/Takeout',
          total: files.length,
          folders: groupedFiles,
        };
        return takeoutFilesCache;
      })
      .finally(() => {
        takeoutFilesLoadPromise = null;
      });
  }

  return takeoutFilesLoadPromise;
};

app.use(createCompressionMiddleware());

app.use((req, res, next) => {
  // Allow all origins (safe for local dev). Adjust in production.
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  // If you'd like to allow cookies, set this to 'true' and set Access-Control-Allow-Origin to a specific origin.
  res.setHeader('Access-Control-Allow-Credentials', 'false');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

// parse JSON bodies for script control endpoints
app.use(express.json());


// Generic cache wrapper for async route handlers
function withCache(handler, ttlMs) {
  let cache = null;
  let cacheTime = 0;
  return async function(req, res) {
    const now = Date.now();
    if (cache && (now - cacheTime < ttlMs)) {
      if (typeof cache === 'function') {
        // Defensive: if cache is a function, don't return it
        return handler(req, res);
      }
      return res.json(cache);
    }
    try {
      const result = await handler(req, res, true); // pass true to indicate cache miss
      cache = result;
      cacheTime = Date.now();
      if (result !== undefined) {
        res.json(result);
      }
    } catch (error) {
      cache = null;
      cacheTime = 0;
      throw error;
    }
  };
}

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Usage example for /thumbnails-size
app.get('/thumbnails-size', withCache(async (_req, res, cacheMiss) => {
  try {
    const totalSize = await getDirectorySize(thumbnailsRoot);
    return { size: totalSize };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to calculate thumbnails size: ${message}` });
    return;
  }
}, 30 * 1000)); // 30 seconds

app.get('/takeout-files', async (_req, res) => {
  try {
    const payload = await loadTakeoutFiles();
    res.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read /src/Takeout: ${message}` });
  }
});

// List allowlisted scripts
app.get('/scripts', (_req, res) => {
  res.json({ scripts: listScripts() });
});

// Run a script (sync or async)
app.post('/scripts/run', async (req, res) => {
  try {
    console.log('Received request to run script:', req.body);
    const { script, mode = 'async', config = {}, timeoutMs = 0 } = req.body || {};
    if (!script || typeof script !== 'string') return res.status(400).json({ error: 'script is required' });

    if (mode === 'sync') {
      const job = await runScriptSync(script, config, Number(timeoutMs) || 0);
      return res.json({ jobId: job.id, exitCode: job.exitCode, status: job.status, stdout: job.stdout, stderr: job.stderr });
    }

    const job = await spawnScript(script, config, Number(timeoutMs) || 0);
    return res.json({ jobId: job.id, status: 'started' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: `Failed to run script: ${message}` });
  }
});

// Job status
app.get('/jobs/:id', (req, res) => {
  const job = getJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  return res.json({ id: job.id, script: job.script, status: job.status, startTime: job.startTime, endTime: job.endTime ?? null, exitCode: job.exitCode, stdout: job.stdout, stderr: job.stderr, killed: job.killed });
});

app.delete('/jobs/:id', (req, res) => {
  const ok = cancelJob(req.params.id);
  res.json({ cancelled: ok });
});

// Config endpoints
app.get('/config', (_req, res) => {
  res.json(getConfig());
});

app.post('/config', async (req, res) => {
  try {
    const newConf = await setConfig(req.body || {});
    // Refresh in-memory roots based on updated config
    thumbnailsRoot = path.resolve(process.cwd(), newConf.TARGET_ROOT ?? newConf.OUTPUT_DIR ?? 'thumbnails');
    takeoutRoot = path.resolve(process.cwd(), newConf.TAKEOUT_ROOT ?? 'Takeout');
    res.json(newConf);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: `Failed to update config: ${message}` });
  }
});

app.get('/thumbnail-files', withCache(async (_req, res, cacheMiss) => {
  try {
    const files = await listSortedFiles(thumbnailsRoot);

    console.log('Thumbnail files:', files);
    const groupedFiles = groupFilesByFolder(files);

    return {
      root: thumbnailsRoot,
      total: files.length,
      folders: groupedFiles,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read /src/thumbnails: ${message}` });
    return;
  }
}, 5 * 1000)); // 30 seconds

app.get('/original-files', withCache(async (_req, res, cacheMiss) => {
  try {
    const files = await listSortedFiles(takeoutRoot);

    const fileSet = new Set(files
      .filter((f) => f.toLowerCase().endsWith('.json'))
      .map((f) => f.split('.').slice(0, -2).join('.'))
    );

    const jsonRichFiles = files.filter((file) => {
      const lower = file.toLowerCase();

      return (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) && fileSet.has(file);
    });

    const groupedFiles = groupFilesByFolder(jsonRichFiles);

    return {
      root: takeoutRoot,
      total: files.length,
      folders: groupedFiles,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read takeout folder: ${message}` });
    return;
  }
}, 5 * 1000)); // 5 seconds

const PREVIEW_LIMIT = 50;

app.get('/thumbnails-preview', withCache(async (req, res, cacheMiss) => {
  try {
    // Set browser cache for 5 minutes
    res.set('Cache-Control', 'public, max-age=300, immutable');
    const files = await listSortedFiles(thumbnailsRoot);
    const albumId = typeof req.query.albumId === 'string' ? req.query.albumId.trim() : '';
    const filteredFiles = albumId ? filterFilesByAlbum(files, albumId) : files;
    const previewFiles = selectRandomThumbnailPreviewFiles(filteredFiles, PREVIEW_LIMIT);

    return {
      root: '/thumbnails',
      limit: PREVIEW_LIMIT,
      totalAvailable: filteredFiles.length,
      returned: previewFiles.length,
      files: previewFiles,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to build thumbnail preview: ${message}` });
    return;
  }
}, 30 * 1000)); // 30 seconds

app.get('/takeout-metadata', withCache(async (_req, res, cacheMiss) => {
  try {
    const cfg = getConfig();
    const metadataFile = cfg && cfg.JSON_PATH
      ? path.resolve(String(cfg.JSON_PATH))
      : path.resolve(thumbnailsRoot, 'metadata.json');

    const raw = await readFile(metadataFile, 'utf8');
    res.type('application/x-ndjson');
    res.send(raw);

    return;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read metadata.json: ${message}` });
    return;
  }
}, 30 * 1000)); // 30 seconds

const airportsFile = path.resolve(process.cwd(), 'airports.json');

app.get('/takeout-airports', withCache(async (_req, res, cacheMiss) => {
  try {
    // Set browser cache for 7 days
    res.set('Cache-Control', 'public, max-age=604800, immutable');
    const raw = await readFile(airportsFile, 'utf8');
    const parsed = JSON.parse(raw);
    return { metadata: parsed };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read airports.json: ${message}` });
    return;
  }
}, 7 * 24 * 60 * 60 * 1000)); // 7 days

const citiesFile = path.resolve(process.cwd(), 'cities.json');

app.get('/takeout-cities', withCache(async (_req, res, cacheMiss) => {
  try {
    // Set browser cache for 7 days
    res.set('Cache-Control', 'public, max-age=604800, immutable');
    const raw = await readFile(citiesFile, 'utf8');
    const parsed = JSON.parse(raw);
    return { metadata: parsed.filter(p => p.population > 15000).map(({ name, lat, lng, country }) => ({ name, lat, lng, country })) };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ error: `Failed to read cities.json: ${message}` });
    return;
  }
}, 7 * 24 * 60 * 60 * 1000)); // 7 days

app.use('/thumbnails', (req, res, next) => {
  return express.static(path.resolve(thumbnailsRoot, 'thumbnails'), {
    immutable: true,
    maxAge: '365d',
    index: false,
    redirect: false,
    fallthrough: false,
    setHeaders(response) {
      response.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    },
  })(req, res, next);
});

app.get(/^\/images\/(.+)$/, (req, res) => {
  const relativePath = req.params[0];
  if (!relativePath) {
    return res.status(400).json({ error: 'Invalid path' });
  }
  const absolutePath = path.resolve(takeoutRoot, relativePath);

  if (!absolutePath.startsWith(takeoutRoot + path.sep) && absolutePath !== takeoutRoot) {
    return res.status(400).json({ error: 'Invalid path' });
  }

  if (!isTakeoutImageFile(absolutePath)) {
    return res.status(400).json({ error: 'Not an image file' });
  }

  res.set('Cache-Control', 'public, max-age=36000, immutable');

  res.sendFile(absolutePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'Image not found' });
    }
  });
});

;(async function start() {
  try {
    await ensureServerConfig();
    app.listen(port, () => {
      console.log(`Takeout file server listening on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Server failed to start:', err);
    process.exit(1);
  }
})();
