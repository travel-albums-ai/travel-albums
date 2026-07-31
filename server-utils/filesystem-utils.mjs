import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import pLimit from 'p-limit';

const DIRECTORY_SIZE_CONCURRENCY_LIMIT = 32;

const limit = pLimit(DIRECTORY_SIZE_CONCURRENCY_LIMIT);

export async function getDirectorySize(directory) {
  const entries = await readdir(directory, { withFileTypes: true });

  const sizes = await Promise.all(
    entries.map((entry) =>
      limit(async () => {
        const absolutePath = path.join(directory, entry.name);

        if (entry.isDirectory()) {
          return getDirectorySize(absolutePath);
        }

        if (entry.isFile()) {
          const fileStat = await stat(absolutePath);
          return fileStat.size;
        }

        return 0;
      })
    )
  );

  return sizes.reduce((a, b) => a + b, 0);
}

export async function listFilesRecursively(directory, rootDirectory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await listFilesRecursively(absolutePath, rootDirectory);
      files.push(...nestedFiles);
      continue;
    }

    if (entry.isFile()) {
      files.push(path.relative(rootDirectory, absolutePath));
    }
  }

  return files;
}

export async function listSortedFiles(rootDirectory) {
  const files = await listFilesRecursively(rootDirectory, rootDirectory);
  files.sort((a, b) => a.localeCompare(b));
  return files;
}

export function groupFilesByFolder(files) {
  return files.reduce((accumulator, relativeFilePath) => {
    const folder = path.dirname(relativeFilePath);
    const folderKey = folder === '.' ? '/' : folder;

    if (!accumulator[folderKey]) {
      accumulator[folderKey] = [];
    }

    accumulator[folderKey].push(path.basename(relativeFilePath));
    return accumulator;
  }, {});
}
