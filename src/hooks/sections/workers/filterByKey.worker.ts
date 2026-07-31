import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';

type NumericKey = 'views' | 'likes' | 'comments';
type Bucket = Record<string, GalleryPhoto[]>;

function createNumericBucketMapper(keyName: NumericKey) {
  return (photo: GalleryPhoto) => {
    const value = (photo as any)[keyName] || 0;

    if (typeof value !== 'number') return null;
    if (value <= 0) return null;
    if (value > 100) return 'over 100';
    if (value > 50) return 'over 50';
    if (value > 10) return 'over 10';
    return '10 or less';
  };
}

function sortPhotosByKey(photos: GalleryPhoto[], key: NumericKey): GalleryPhoto[] {
  return [...photos].sort((a, b) => {
    const av = (a as any)[key];
    const bv = (b as any)[key];
    return typeof av === 'number' && typeof bv === 'number' ? bv - av : 0;
  });
}

function iterate(photos: GalleryPhoto[], mapper: (photo: GalleryPhoto) => string | null): Bucket {
  return photos.reduce((acc: Bucket, photo) => {
    const label = mapper(photo);
    if (!label) return acc;
    acc[label] ??= [];
    acc[label].push(photo);
    return acc;
  }, {});
}

function compose(bucket: Bucket) {
  return Object.entries(bucket).map(([name, photos]) => ({ name, photos }));
}

export default function workerFilterByKey(photos: GalleryPhoto[], key: NumericKey) {
  if (!photos?.length) return [];

  return benchmarkFunction(
    () => compose(iterate(sortPhotosByKey(photos, key), createNumericBucketMapper(key))),
    '🤖 filterByKeyWorker',
    [`${photos.length} photos`, `key: ${key}`]);
}
