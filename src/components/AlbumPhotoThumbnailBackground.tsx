import { useSettingsStoreSelector } from '@/context/settingsStore';
import { imageUrl as imageUrlFunc, thumbnailUrl } from '@/lib/thumbnailService';
import React from 'react';

type Props = {
  imageUrl: string | null;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  original?: boolean;
  imageObj?: any;
};

export default function AlbumPhotoThumbnailBackground({
  imageUrl,
  width,
  height,
  style,
  className,
  original,
  imageObj,
}: Props) {
  const demoMode = useSettingsStoreSelector(s => s.demoMode);
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);

  if (!imageUrl) return null;

  const src = original
    ? imageUrlFunc(`${imageObj.folder}/${imageObj.title}`, demoMode)
    : thumbnailUrl(imageUrl, demoMode);

  return (
    <img
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
