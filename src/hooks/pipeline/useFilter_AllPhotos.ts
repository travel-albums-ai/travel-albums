import { useFilterStoreSelector } from '@/context/filterStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useIgnoredStoreSelector } from '@/context/ignoredStore';
import { usePrivateStoreSelector } from '@/context/privateStore';
import { GalleryPhoto } from '@/lib/galleryData';
import { useEffect, useMemo, useRef, useState } from 'react';

type WorkerMsg =
  | { type: 'INIT_PHOTOS'; payload: GalleryPhoto[] }
  | { type: 'UPDATE_FILTERS'; payload: any };

export const useFilter_AllPhotos = (enabled = true) => {
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const settings = useFilterStoreSelector(s => s);
  const privatePhotos = usePrivateStoreSelector(s => s.photos);
  const ignoredPhotos = useIgnoredStoreSelector(s => s.photos);

  const [indices, setIndices] = useState<Uint32Array>(new Uint32Array(0));
  const workerRef = useRef<Worker | null>(null);
  const photosInitializedRef = useRef(false);

  // The photo array the worker's indices are valid against. Only updated
  // when we actually INIT_PHOTOS, so index-mapping below always lines up
  // with what the worker computed against — even if rawPhotos identity
  // changes later without a re-init (see note below).
  const indexedPhotosRef = useRef<GalleryPhoto[]>([]);

  // init worker once
  useEffect(() => {
    const worker = new Worker(
      new URL('./allPhotosFilter.worker.ts', import.meta.url),
      { type: 'module' }
    );

    worker.onmessage = (e: MessageEvent<Uint32Array>) => {
      setIndices(e.data);
    };

    workerRef.current = worker;

    return () => worker.terminate();
  }, []);

  // init photos ONCE
  // NOTE: if rawPhotos can ever change identity after first load (e.g. a
  // later streaming batch appends more photos), this needs to re-fire and
  // re-INIT_PHOTOS, or indices returned here will silently map against a
  // stale array. Currently assumes rawPhotos is loaded once and is stable.
  useEffect(() => {
    if (!rawPhotos || photosInitializedRef.current) return;

    workerRef.current?.postMessage({
      type: 'INIT_PHOTOS',
      payload: rawPhotos,
    } satisfies WorkerMsg);

    indexedPhotosRef.current = rawPhotos;
    photosInitializedRef.current = true;
  }, [rawPhotos]);

  // update filters only
  useEffect(() => {
    if (!enabled) {
      setIndices(new Uint32Array(0));
      return;
    }

    workerRef.current?.postMessage({
      type: 'UPDATE_FILTERS',
      payload: {
        settings,
        privatePhotos,
        ignoredPhotos,
      },
    } satisfies WorkerMsg);
  }, [enabled, settings, privatePhotos, ignoredPhotos]);

  // Map indices -> photo objects lazily, only when the worker actually
  // produces a new result. This is the one place we pay for object
  // references again, and it's a cheap array walk, not a structured clone.
  const result = useMemo(() => {
    const photos = indexedPhotosRef.current;
    const out = new Array<GalleryPhoto>(indices.length);
    for (let i = 0; i < indices.length; i++) {
      out[i] = photos[indices[i]];
    }
    return out;
  }, [indices]);

  return result;
};
