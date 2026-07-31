import { FilterStore } from '@/context/filterStore';
import { GalleryPhoto } from '@/lib/galleryData';

export const filterPhotosByAllPhotosSettings = (
  photos: GalleryPhoto[],
  settings: FilterStore,
  excludedPhotos: Set<string>, // merged private + ignored, built once by caller
): Uint32Array => {
  const {
    showWithWithoutPersons,
    showWithWithoutGps,
    showViews,
    showViewsMin,
    showLikes,
    showLikesMin,
    filterDates,
    filterCountries,
    filterFolders,
    filterPeopleAndPets,
    dates,
    sections,
    filterGps,
    sortOrder,
    gps,
  } = settings;

  const activeDates = filterDates ? dates.filter((d) => d.active) : null;
  const datesLen = activeDates?.length ?? 0;

  const activeSections: { isInclude: boolean; set: Set<string> }[] = [];
  const sectionKeys = Object.keys(sections);
  for (let k = 0; k < sectionKeys.length; k++) {
    const key = sectionKeys[k];
    if (key === 'peopleAndPets' && !filterPeopleAndPets) continue;
    if (key === 'folders' && !filterFolders) continue;
    if (key === 'countries' && !filterCountries) continue;

    const section = sections[key];
    if (section.included.length > 0 && section.includedPhotos) {
      activeSections.push({ isInclude: true, set: section.includedPhotos });
    }
    if (section.excluded.length > 0 && section.excludedPhotos) {
      activeSections.push({ isInclude: false, set: section.excludedPhotos });
    }
  }
  const sectionsLen = activeSections.length;

  const n = photos.length;
  const reversed = sortOrder !== 'newestFirst';

  // Pre-sized worst case, written by index — avoids push()'s repeated
  // backing-store growth on large libraries.
  const matched = new Uint32Array(n);
  let count = 0;

  // Single pass, correct direction from the start. `photos` is assumed
  // pre-sorted newest-first at the source, so walking it back-to-front
  // yields oldest-first output with zero extra passes.
  for (let idx = 0; idx < n; idx++) {
    const i = reversed ? n - 1 - idx : idx;
    const photo = photos[i];
    const photoId = photo.id;

    if (excludedPhotos.has(photoId)) continue;

    if (filterGps) {
      const { latitude, longitude } = photo;
      if (latitude === 0 && longitude === 0) continue;
      if (latitude === undefined && longitude === undefined) continue;
      if (latitude < gps.south || latitude > gps.north || longitude < gps.west || longitude > gps.east) {
        continue;
      }
    }

    if (showWithWithoutPersons !== null) {
      const hasPersons = (photo.people?.length ?? 0) > 0;
      if (showWithWithoutPersons ? hasPersons : !hasPersons) continue;
    }

    if (showWithWithoutGps !== null) {
      const hasGps = photo.latitude !== undefined && photo.longitude !== undefined;
      if (showWithWithoutGps ? hasGps : !hasGps) continue;
    }

    if (showViews && photo.views < showViewsMin) continue;

    if (showLikes) {
      const social = photo.social;
      if (!social) continue;

      let likes = 0;
      let metMin = false;
      for (let j = 0; j < social.length; j++) {
        if (social[j].liked && ++likes >= showLikesMin) { metMin = true; break; }
      }
      if (!metMin) continue;
    }

    if (datesLen > 0) {
      const ts = photo.takenAtTs * 1000;
      let inRange = false;
      for (let j = 0; j < datesLen; j++) {
        const d = activeDates![j];
        if (ts >= d.startDate && ts <= d.endDate) { inRange = true; break; }
      }
      if (!inRange) continue;
    }

    let sectionFailed = false;
    for (let j = 0; j < sectionsLen; j++) {
      const { isInclude, set } = activeSections[j];
      if (isInclude ? !set.has(photoId) : set.has(photoId)) {
        sectionFailed = true;
        break;
      }
    }
    if (sectionFailed) continue;

    matched[count++] = i;
  }

  return matched.subarray(0, count);
};

type Filters = {
  settings: FilterStore;
  privatePhotos: string[];
  ignoredPhotos: string[];
};

let photos: GalleryPhoto[] = [];
let filters: Filters | null = null;

let photosDirty = false;
let filtersDirty = false;

function buildExcluded(privatePhotos: string[], ignoredPhotos: string[]) {
  const set = new Set(privatePhotos);
  for (let i = 0; i < ignoredPhotos.length; i++) {
    set.add(ignoredPhotos[i]);
  }
  return set;
}

function recompute() {
  if (!filters || !photos.length) return;
  if (!photosDirty && !filtersDirty) return;
  photosDirty = false;
  filtersDirty = false;

  const excluded = buildExcluded(filters.privatePhotos, filters.ignoredPhotos);
  const indices = filterPhotosByAllPhotosSettings(photos, filters.settings, excluded);

  // Transfer, don't clone: hands over the buffer pointer instead of
  // structured-cloning every matched GalleryPhoto object.
  self.postMessage(indices, [indices.buffer]);
}

self.onmessage = (e) => {
  const { type, payload } = e.data;

  switch (type) {
    case 'INIT_PHOTOS':
      photos = payload;
      photosDirty = true;
      recompute();
      break;

    case 'UPDATE_FILTERS':
      filters = payload;
      filtersDirty = true;
      recompute();
      break;
  }
};
