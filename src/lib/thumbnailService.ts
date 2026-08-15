import { getSettingsStore } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';

const SERVER_ORIGIN = import.meta.env.VITE_TAKEOUT_SERVER_ORIGIN?.trim() || 'http://localhost:3001'
const SERVER_ORIGIN_DEMO_THUMBNAILS = 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev/thumbnails'
const SERVER_ORIGIN_DEMO_IMAGES = 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev'

const BASE_URL_THUMBNAILS = `${SERVER_ORIGIN}/thumbnails`
const BASE_URL_IMAGES = `${SERVER_ORIGIN}/images`

const toDemoPath = (relativePath: string) =>
  relativePath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')
    .replace("%3A%3A", "%EF%80%BA%EF%80%BA")

export const composeUrl = (photo: GalleryPhoto, original = false) => {
  const demo = getSettingsStore().demoMode;
  const composePath = `${photo.rootIndex}/${encodeURIComponent(photo.folder ?? '')}/${encodeURIComponent(photo.title ?? '')}`

  return original
    ? demo
      ? `${SERVER_ORIGIN_DEMO_IMAGES}/${toDemoPath(composePath)}`
      : `${BASE_URL_IMAGES}/${composePath}`
    : demo
      ? `${SERVER_ORIGIN_DEMO_THUMBNAILS}/${toDemoPath(composePath)}`
      : `${BASE_URL_THUMBNAILS}/${composePath}`
}
