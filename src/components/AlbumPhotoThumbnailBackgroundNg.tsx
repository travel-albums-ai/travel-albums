import { useSettingsStoreSelector } from '@/context/settingsStore';
import { GalleryPhoto } from '@/lib/galleryData';
import { originalUrlNg, thumbnailUrlNg } from '@/lib/thumbnailService';
import React from 'react';

type Props = {
  photo: GalleryPhoto;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  original?: boolean;
};

export default function AlbumPhotoThumbnailBackgroundNg({
  photo,
  width,
  height,
  style,
  className,
  original,
}: Props) {
  const demoMode = useSettingsStoreSelector(s => s.demoMode);
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);

  const composePath = `${photo.rootIndex}/${encodeURIComponent(photo.folder ?? '')}/${encodeURIComponent(photo.title ?? '')}`

  const src = original
    ? originalUrlNg(composePath, demoMode)
    : thumbnailUrlNg(composePath, demoMode);

  return (
    <img
      key={src}
      src={src}
      alt=""
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
      className={className}
      style={{
        width: '100%',
        height,
        display: 'block',
        objectFit: thumbnailFormat === 'cover' ? 'cover' : 'contain',
        objectPosition: 'center',
        ...style,
      }}
    />
  );
}
