import { useFavoritesStoreSelector } from '@/context/favoritesStore';
import { useFilterStoreSelector } from '@/context/filterStore';
import { useFilteredGpsPhotos_GLOBAL } from '@/context/globals/filteredGpsPhotosStore';
import { useFilteredPhotos_GLOBAL } from '@/context/globals/filteredPhotosStore';
import { useUnfilteredPhotos_GLOBAL } from '@/context/globals/unfilteredPhotosStore';
import { useIgnoredStoreSelector } from '@/context/ignoredStore';
import { useLabelsStoreSelector } from '@/context/labelsStore';
import { usePrivateStoreSelector } from '@/context/privateStore';
import { useSelectedStoreSelector } from '@/context/selectedStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import { useSidebarStoreSelector } from '@/context/sidebarStore';
import { useTagsStoreSelector } from '@/context/tagsStore';
import albumsWorker from '@/hooks/sections/workers/albums.worker';
import citiesWorker from '@/hooks/sections/workers/cities.worker';
import countriesWorker from '@/hooks/sections/workers/countries.worker';
import workerFilterByKey from '@/hooks/sections/workers/filterByKey.worker';
import grouperWorker from '@/hooks/sections/workers/grouper.worker';
import labelsWorker from '@/hooks/sections/workers/labels.worker';
import nowAndThenWorker from '@/hooks/sections/workers/nowAndThen.worker';
import peopleAndPetsWorker from '@/hooks/sections/workers/peopleGrouping.worker';
import tagsWorker from '@/hooks/sections/workers/tags.worker';
import timelineWorker from '@/hooks/sections/workers/timeline.worker';
import { benchmarkFunction } from '@/hooks/utils';
import { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

export interface SectionCover {
  title: string,
  data: any
}

export interface Section {
  type: string,
  title: string,
  data: any,
  preview?: boolean,
  secondary?: boolean,
  topData?: GalleryPhoto[],
  cover?: SectionCover
}

export function useFilteredSections(): Section[] {
  const { t } = useTranslation()

  const photos = useFilteredPhotos_GLOBAL();
  const rawPhotos = useUnfilteredPhotos_GLOBAL();
  const photosGps = useFilteredGpsPhotos_GLOBAL();

  const modules = useSettingsStoreSelector(s => s.modules);
  const sortOrder = useFilterStoreSelector(s => s.sortOrder);
  const favoritePhotoIds = useFavoritesStoreSelector(s => s.photos)
  const labelsPrimary = useLabelsStoreSelector(s => s.labelsPrimary)
  const ignoredPhotoIds = useIgnoredStoreSelector(s => s.photos)
  const privatePhotoIds = usePrivateStoreSelector(s => s.photos)
  const selectedPhotos = useSelectedStoreSelector(s => s.photos)
  const tagsStore = useTagsStoreSelector(s => s);

  const sidebarOpen = useSidebarStoreSelector((s) => s.sidebarOpen);

  const hasData = !!photos && !!rawPhotos && !!photosGps
    && photos.length > 0 && rawPhotos.length > 0 && photosGps.length > 0;

  const peopleAndPetsData = useMemo(() => (hasData && modules.peopleAndPets && sidebarOpen.peopleAndPets) ? peopleAndPetsWorker(photos) : [], [hasData, modules.peopleAndPets, photos, sidebarOpen.peopleAndPets]);
  const nowAndThenData = useMemo(() => (hasData && modules.nowAndThen && sidebarOpen.nowAndThen) ? nowAndThenWorker(photos) : [], [hasData, modules.nowAndThen, photos, sidebarOpen.nowAndThen]);
  const foldersData = useMemo(() => (hasData && modules.folders && sidebarOpen.folders) ? albumsWorker(photos, sortOrder) : [], [hasData, modules.folders, photos, sortOrder, sidebarOpen.folders]);
  const citiesData = useMemo(() => (hasData && modules.cities && sidebarOpen.cities) ? citiesWorker(photosGps) : [], [hasData, modules.cities, photosGps, sidebarOpen.cities]);
  const countriesData = useMemo(() => (hasData && modules.countries && sidebarOpen.countries) ? countriesWorker(photosGps) : [], [hasData, modules.countries, photosGps, sidebarOpen.countries]);
  const viewedData = useMemo(() => (hasData && modules.views && sidebarOpen.views) ? workerFilterByKey(photos, 'views') : [], [hasData, modules.views, photos, sidebarOpen.views]);
  const timelineData = useMemo(() => (hasData && modules.timeline && sidebarOpen.timeline) ? timelineWorker(photos) : [], [hasData, modules.timeline, photos, sidebarOpen.timeline]);
  const mostLikedData = useMemo(() => (hasData && modules.likes && sidebarOpen.likes) ? workerFilterByKey(photos, 'likes') : [], [hasData, modules.likes, photos, sidebarOpen.likes]);
  const mostCommentedData = useMemo(() => (hasData && modules.comments && sidebarOpen.comments) ? workerFilterByKey(photos, 'comments') : [], [hasData, modules.comments, photos, sidebarOpen.comments]);
  const favoritesData = useMemo(() => (hasData && modules.favorites && sidebarOpen.favorites) ? grouperWorker(photos, favoritePhotoIds, 'Your favorites') : [], [hasData, modules.favorites, photos, favoritePhotoIds, sidebarOpen.favorites]);
  const tagsData = useMemo(() => (hasData && modules.tags && sidebarOpen.tags) ? tagsWorker(photos, tagsStore) : [], [hasData, modules.tags, photos, tagsStore, sidebarOpen.tags]);
  const labelsData = useMemo(() => (hasData && modules.labels && sidebarOpen.labels) ? labelsWorker(photos, labelsPrimary) : [], [hasData, modules.labels, photos, labelsPrimary, sidebarOpen.labels]);
  const ignoredData = useMemo(() => (hasData && modules.ignored) ? grouperWorker(rawPhotos, ignoredPhotoIds, 'Your ignored') : [], [hasData, modules.ignored, rawPhotos, ignoredPhotoIds]);
  const privateData = useMemo(() => (hasData && modules.private) ? grouperWorker(rawPhotos, privatePhotoIds, 'Your private') : [], [hasData, modules.private, rawPhotos, privatePhotoIds]);
  const selectedData = useMemo(() => (hasData && modules.selected) ? grouperWorker(rawPhotos, selectedPhotos, 'Your selected') : [], [hasData, modules.selected, rawPhotos, selectedPhotos]);

  return useMemo(() => {
    if (!hasData) return [];

    return benchmarkFunction(() => ([
      { type: 'peopleAndPets', title: t('sectionPeopleAndPets'), data: peopleAndPetsData, preview: true },
      { type: 'nowAndThen', title: t('sectionNowAndThen'), data: nowAndThenData },
      { type: 'folders', title: t('sectionFolders'), data: foldersData },
      { type: 'cities', title: t('sectionCities'), preview: true, data: citiesData },
      { type: 'countries', title: t('sectionCountries'), preview: true, data: countriesData },
      { type: 'views', title: t('sectionViews'), data: viewedData },
      { type: 'timeline', title: t('sectionTimeline'), data: timelineData },
      { type: 'likes', title: t('sectionLikes'), data: mostLikedData },
      { type: 'comments', title: t('sectionComments'), data: mostCommentedData },
      { type: 'favorites', title: t('sectionFavorites'), data: favoritesData },
      { type: 'tags', title: t('sectionTags'), data: tagsData, preview: true },
      { type: 'labels', title: t('sectionLabels'), data: labelsData },
      { type: 'ignored', title: t('sectionIgnored'), data: ignoredData },
      { type: 'private', title: t('sectionPrivate'), data: privateData },
      { type: 'selected', title: t('sectionSelected'), data: selectedData },
    ] satisfies Section[]), 'useFilteredSections', [`${photos?.length ?? 0} photos`]);
  }, [
    hasData, t,
    peopleAndPetsData, nowAndThenData, foldersData, citiesData,
    countriesData, viewedData, timelineData, mostLikedData, mostCommentedData,
    favoritesData, tagsData, labelsData, ignoredData, privateData, selectedData,
    photos,
  ]);
}
