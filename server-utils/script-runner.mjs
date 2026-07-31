import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

const projectRoot = path.resolve(process.cwd());
const scriptsDir = path.join(projectRoot, 'scripts');
const NDJSON_PATH = path.join(projectRoot, 'data.ndjson');
const JSON_PATH = "/mnt/f/temp/metadata.json";
const TAKEOUT_ROOT = "/mnt/f/Takeout";
const TARGET_ROOT = "/mnt/f/temp/thumbnails";

const ALLOWLIST = new Set([
  'generateTakeoutThumbnails.mjs',
  'indexer.mjs',
  'indexer.cjs',
  'generateTakeoutMetadata.mjs',
  'convertMetadata.mjs',
]);

// Env keys removed: we now pass configuration via a per-job JSON file.

const jobs = new Map();

// We no longer inject environment variables into scripts. Instead we
// write a per-job JSON config file (kept under .script-configs/) and
// invoke the script with a `--config <path>` argument. This keeps
// configuration explicit and file-based.

async function _writeJobConfig(jobId, cfg) {
  const dir = path.join(projectRoot, '.script-configs');
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {}
  const cfgPath = path.join(dir, `${jobId}.json`);
  await fs.writeFile(cfgPath, JSON.stringify(cfg, null, 2), 'utf8');
  return cfgPath;
}

function listScripts() {
  return Array.from(ALLOWLIST);
}

function getJob(id) {
  return jobs.get(id) || null;
}

function _capture(stream, appendFn) {
  stream.on('data', (d) => appendFn(d.toString()));
}

async function spawnScript(scriptName, configOverrides = {}, timeoutMs = 0) {
  if (!ALLOWLIST.has(scriptName)) {
    throw new Error('Script not allowed');
  }

  const jobId = 'indexer';

  // Return existing job if it is still active
  const existingJob = jobs.get(jobId);

  if (
    existingJob &&
    existingJob.status !== 'finished' &&
    existingJob.status !== 'error'
  ) {
    return existingJob;
  }

  const scriptPath = path.join(scriptsDir, scriptName);

  const job = {
    id: jobId,
    script: scriptName,
    startTime: Date.now(),
    status: 'running',
    exitCode: null,
    stdout: '',
    stderr: '',
    killed: false,
  };

  jobs.set(jobId, job);

  // Merge global server config with per-invocation overrides and
  // write to a JSON file which will be passed to the script.
  const merged = { ...serverConfig, ...configOverrides };

  let configPath;
  try {
    configPath = await _writeJobConfig(jobId, merged);
  } catch (err) {
    job.status = 'error';
    job.stderr += '\n' + (err?.message ?? String(err));
    job.endTime = Date.now();
    return job;
  }

  const child = spawn(process.execPath, [scriptPath, '--config', configPath], {
    env: process.env,
    cwd: projectRoot,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const MAX_LOG = 200 * 1024;

  _capture(child.stdout, (s) => {
    job.stdout += s;
    if (job.stdout.length > MAX_LOG) {
      job.stdout = job.stdout.slice(-MAX_LOG);
    }
  });

  _capture(child.stderr, (s) => {
    job.stderr += s;
    if (job.stderr.length > MAX_LOG) {
      job.stderr = job.stderr.slice(-MAX_LOG);
    }
  });

  let killer = null;

  if (timeoutMs > 0) {
    killer = setTimeout(() => {
      job.killed = true;

      try {
        child.kill('SIGKILL');
      } catch {}
    }, timeoutMs);
  }

  child.on('close', (code) => {
    if (killer) clearTimeout(killer);

    job.exitCode = code;
    job.status = 'finished';
    job.endTime = Date.now();
  });

  child.on('error', (err) => {
    job.stderr += '\n' + (err?.message ?? String(err));
    job.status = 'error';
    job.endTime = Date.now();
  });

  job._child = child;

  return job;
}

async function runScriptSync(scriptName, configOverrides = {}, timeoutMs = 0) {
  const job = await spawnScript(scriptName, configOverrides, timeoutMs);
  return new Promise((resolve) => {
    const check = () => {
      if (job.status !== 'running') {
        resolve(job);
      } else {
        setTimeout(check, 200);
      }
    };
    check();
  });
}

function listJobs() {
  return Array.from(jobs.values()).map(j => ({ id: j.id, script: j.script, status: j.status, startTime: j.startTime, endTime: j.endTime ?? null }));
}

function cancelJob(id) {
  const job = jobs.get(id);
  if (!job) return false;
  if (job._child && job.status === 'running') {
    try { job._child.kill('SIGKILL'); job.killed = true; return true; } catch { return false; }
  }
  return false;
}

let serverConfig = {
  projectRoot,
  scriptsDir,
  NDJSON_PATH,
  JSON_PATH,
  TAKEOUT_ROOT,
  TARGET_ROOT,
};

function getConfig() {
  return serverConfig;
}

async function setConfig(newConfig = {}) {
  serverConfig = { ...serverConfig, ...newConfig };
  // persist to disk for convenience
  try {
    await fs.writeFile(path.join(projectRoot, 'server-config.json'), JSON.stringify(serverConfig, null, 2), 'utf8');
  } catch {}
  return serverConfig;
}

export { cancelJob, getConfig, getJob, listJobs, listScripts, runScriptSync, setConfig, spawnScript };
