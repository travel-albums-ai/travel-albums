import path from 'node:path';

const TAKEOUT_IMAGE_EXTENSION_REGEX = /\.(jpe?g|png|webp|gif|tiff?|avif)$/i;

export const isTakeoutImageFile = (filePath) =>
  TAKEOUT_IMAGE_EXTENSION_REGEX.test(filePath);

const shuffleInPlace = (array) => {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const filterFilesByAlbum = (files, albumId) =>
  files.filter((relativeFilePath) => {
    const [album = '/'] = relativeFilePath.split(path.sep);
    return album === albumId;
  });

export function selectRandomThumbnailPreviewFiles(files, limit = 100) {
  const imageFiles = files.filter((file) => TAKEOUT_IMAGE_EXTENSION_REGEX.test(file));
  const filesByAlbum = new Map();

  for (const relativeFilePath of imageFiles) {
    const [album = '/'] = relativeFilePath.split(path.sep);
    if (!filesByAlbum.has(album)) {
      filesByAlbum.set(album, []);
    }
    filesByAlbum.get(album).push(relativeFilePath);
  }

  const albumBuckets = [...filesByAlbum.entries()].map(([album, albumFiles]) => ({
    album,
    files: shuffleInPlace([...albumFiles]),
    index: 0,
  }));

  shuffleInPlace(albumBuckets);

  const selectedFiles = [];
  while (selectedFiles.length < limit) {
    let addedInRound = false;

    for (const bucket of albumBuckets) {
      if (bucket.index >= bucket.files.length) {
        continue;
      }

      selectedFiles.push(bucket.files[bucket.index]);
      bucket.index += 1;
      addedInRound = true;

      if (selectedFiles.length >= limit) {
        break;
      }
    }

    if (!addedInRound) {
      break;
    }
  }

  return selectedFiles;
}
