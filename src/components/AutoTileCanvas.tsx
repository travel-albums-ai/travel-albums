import { thumbnailUrl } from '@/lib/thumbnailService';
import { useEffect, useState } from 'react';

type Photo = {
  imageUrl: string
  id: string
}

type Props = {
  photos: Photo[]
  tileSize: number
  columns: number
  gap?: number
}

const loadImageBitmap = async (src: string): Promise<ImageBitmap> => {
  const response = await fetch(src, {
    mode: 'cors',
  })

  if (!response.ok) {
    throw new Error(`Failed to load image: ${response.status}`)
  }

  const blob = await response.blob()

  return createImageBitmap(blob)
}

const drawCover = (
  ctx: OffscreenCanvasRenderingContext2D,
  img: ImageBitmap,
  x: number,
  y: number,
  w: number,
  h: number,
) => {
  const scale = Math.max(
    w / img.width,
    h / img.height,
  )

  const sw = w / scale
  const sh = h / scale

  ctx.drawImage(
    img,
    (img.width - sw) / 2,
    (img.height - sh) / 2,
    sw,
    sh,
    x,
    y,
    w,
    h,
  )
}

export default function AutoTileCanvas({
  photos,
  tileSize,
  columns,
  gap = 2,
}: Props) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    const build = async () => {
      if (!photos.length || tileSize <= 0 || columns <= 0) {
        setPreviewUrl(null)
        return
      }

      const rows = Math.ceil(photos.length / columns)

      const canvasWidth =
        columns * tileSize + (columns - 1) * gap

      const canvasHeight =
        rows * tileSize + (rows - 1) * gap

      const canvas = new OffscreenCanvas(
        canvasWidth,
        canvasHeight,
      )

      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('Could not create 2D canvas context')
      }

      // Transparent background by default.

      const bitmaps: (ImageBitmap | null)[] = []

      const BATCH_SIZE = 6

      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        if (cancelled) return

        const batch = photos.slice(i, i + BATCH_SIZE)

        const loaded = await Promise.all(
          batch.map(async photo => {
            try {
              return await loadImageBitmap(
                thumbnailUrl(photo.id),
              )
            } catch {
              return null
            }
          }),
        )

        bitmaps.push(...loaded)
      }

      if (cancelled) {
        bitmaps.forEach(bitmap => bitmap?.close())
        return
      }

      for (let i = 0; i < bitmaps.length; i++) {
        if (cancelled) break

        const bitmap = bitmaps[i]

        if (!bitmap) continue

        const column = i % columns
        const row = Math.floor(i / columns)

        const x = column * (tileSize + gap)
        const y = row * (tileSize + gap)

        drawCover(
          ctx,
          bitmap,
          x,
          y,
          tileSize,
          tileSize,
        )
      }

      bitmaps.forEach(bitmap => bitmap?.close())

      if (cancelled) return

      const blob = await canvas.convertToBlob({
        type: 'image/jpeg',
        quality: 0.90,
      })

      if (cancelled) return

      objectUrl = URL.createObjectURL(blob)

      setPreviewUrl(objectUrl)
    }

    build().catch(error => {
      if (!cancelled) {
        console.error('Failed to build tile canvas:', error)
        setPreviewUrl(null)
      }
    })

    return () => {
      cancelled = true

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl)
      }
    }
  }, [photos, tileSize, columns, gap])

  if (!previewUrl) {
    return null
  }

  return (
    <img
      src={previewUrl}
      alt=""
      draggable={false}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
      }}
    />
  )
}
