const SERVER_ORIGIN =
  import.meta.env.VITE_TAKEOUT_SERVER_ORIGIN?.trim() || 'http://localhost:3001'
const SERVER_ORIGIN_DEMO = 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev/thumbnails'
const SERVER_ORIGIN_DEMO_IMAGES = 'https://pub-f25bd1b7b4224c528cffe81410a9bf3e.r2.dev'

const TAKEOUT_PREFIX = '/src/Takeout/'
const THUMBNAILS_BASE_URL = `${SERVER_ORIGIN}/thumbnails`
const IMAGES_BASE_URL = `${SERVER_ORIGIN}/images`

const toNormalizedRelativePath = (value: string) =>
  value
    .replaceAll('\\', '/')
    .replace(/^\/+/, '')

const toEndpointPath = (relativePath: string) =>
  relativePath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/')

const toEndpointPathNg = (relativePath: string) =>
  relativePath
    .split('/')
    .filter(Boolean)
    // .map((segment) => encodeURIComponent(segment))
    .join('/')

const toTakeoutRelativePath = (imageUrl: string): string | null => {
  if (!imageUrl) {
    return null
  }

  let pathname = imageUrl
  try {
    pathname = new URL(imageUrl, window.location.origin).pathname
  } catch {
    pathname = imageUrl
  }

  const decodedPathname = decodeURIComponent(pathname)
  const startIndex = decodedPathname.indexOf(TAKEOUT_PREFIX)
  if (startIndex === -1) {
    return null
  }

  return toNormalizedRelativePath(
    decodedPathname.slice(startIndex + TAKEOUT_PREFIX.length),
  )
}

const buildThumbnailUrl = (imageUrl: string): string | null => {
  const relativePath = toTakeoutRelativePath(imageUrl)
  if (!relativePath) {
    return null
  }

  return `${THUMBNAILS_BASE_URL}/${toEndpointPath(relativePath)}`
}

export const thumbnailUrl = (imageId: string, demo = false) => {
  return demo ? `${SERVER_ORIGIN_DEMO}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${THUMBNAILS_BASE_URL}/${toEndpointPath(imageId)}`
}

export const thumbnailUrlNg = (imageId: string, demo = false) => {
  return demo ? `${SERVER_ORIGIN_DEMO}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${THUMBNAILS_BASE_URL}/${imageId}`
}

export const originalUrlNg = (imageId: string, demo = false) => {
  return demo ? `${SERVER_ORIGIN_DEMO_IMAGES}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${IMAGES_BASE_URL}/${imageId}`
}

// export const imageUrlNg = (imageId: string, demo = false) => {
//   return demo ? `${SERVER_ORIGIN_DEMO}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${IMAGES_BASE_URL}/${imageId}`
// }

export const imageUrl = (imageId: string, demo = false) => {
  return demo ? `${SERVER_ORIGIN_DEMO_IMAGES}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${IMAGES_BASE_URL}/${toEndpointPath(imageId)}`
}

export const originalUrl = (imageId: string, demo = false) => {
  return demo ? `${SERVER_ORIGIN_DEMO_IMAGES}/${toEndpointPath(imageId).replace("%3A%3A", "%EF%80%BA%EF%80%BA")}` : `${IMAGES_BASE_URL}/${toEndpointPath(imageId)}`
}

export const serveThumbnailOrOriginal = (imageUrl: string | null): string | null => {
  if (!imageUrl) {
    return null
  }

  return buildThumbnailUrl(imageUrl) ?? imageUrl
}
