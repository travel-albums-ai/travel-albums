import type { GalleryPhoto } from '@/lib/galleryData';
import { useMemo } from 'react';

export type PhotosByMomentGroup = {
  label: string
  photos: GalleryPhoto[]
}

export type PhotosByDayGroup = {
  label: string
  moments: PhotosByMomentGroup[]
}

const UNKNOWN = 'Unknown Date'
const DEFAULT_MOMENT_GAP_MINUTES = 60

const toTimestamp = (p: GalleryPhoto): number => {
  if (p.takenAtTs > 0) return p.takenAtTs

  const date = new Date(p.takenAt ?? '')
  return isNaN(date.getTime()) ? 0 : date.getTime() / 1000
}

const toDayLabel = (p: GalleryPhoto): string => {
  const ts = toTimestamp(p)

  if (ts > 0) {
    const d = new Date(ts * 1000)
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10)
  }

  const parts = p.takenAt
    ?.split(',')
    .slice(0, 2)
    .map(s => s.trim())
    .filter(Boolean)

  return parts?.length ? parts.join(', ') : UNKNOWN
}

const groupBy = <T>(
  arr: T[],
  keyFn: (item: T) => string,
): Record<string, T[]> =>
    arr.reduce<Record<string, T[]>>((acc, item) => {
      const key = keyFn(item)
    ;(acc[key] ??= []).push(item)
      return acc
    }, {})

const groupIntoMoments = (
  photos: GalleryPhoto[],
  gapMinutes: number,
): PhotosByMomentGroup[] => {
  const sorted = [...photos].sort(
    (a, b) => toTimestamp(a) - toTimestamp(b),
  )

  const moments: PhotosByMomentGroup[] = []
  let current: GalleryPhoto[] = []

  for (const photo of sorted) {
    if (!current.length) {
      current.push(photo)
      continue
    }

    const previous = current[current.length - 1]

    const gapMinutesBetween =
      (toTimestamp(photo) - toTimestamp(previous)) / 60

    if (gapMinutesBetween > gapMinutes) {
      moments.push({
        label: formatMomentLabel(current[0]),
        photos: current,
      })

      current = [photo]
    } else {
      current.push(photo)
    }
  }

  if (current.length) {
    moments.push({
      label: formatMomentLabel(current[0]),
      photos: current,
    })
  }

  return moments
}

const formatMomentLabel = (photo: GalleryPhoto): string => {
  const ts = toTimestamp(photo)

  if (!ts) return 'Unknown Time'

  return new Date(ts * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const selectPhotosByDay = (
  photos: GalleryPhoto[],
  momentGapMinutes = DEFAULT_MOMENT_GAP_MINUTES,
): PhotosByDayGroup[] => {
  const byDay = groupBy(photos, toDayLabel)

  return Object.entries(byDay).map(([label, dayPhotos]) => ({
    label,
    moments: groupIntoMoments(dayPhotos, momentGapMinutes),
  }))
}

export const useTransform_PhotosByMoments = (
  photos: GalleryPhoto[],
  momentGapMinutes = DEFAULT_MOMENT_GAP_MINUTES,
) =>
  useMemo(
    () => selectPhotosByDay(photos, momentGapMinutes),
    [photos, momentGapMinutes],
  )
