import { useSettingsStoreSelector } from '@/context/settingsStore';
import { imageUrl as imageUrlFunc, thumbnailUrl } from '@/lib/thumbnailService';
import React, { useEffect, useState } from 'react';

type Props = {
  imageUrl: string | null;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
  original?: boolean;
  imageObj?: any;
};

function AlbumPhotoThumbnailBackground({
  imageUrl,
  width,
  height,
  style,
  className,
  original,
  imageObj
}: Props) {
  const demoMode = useSettingsStoreSelector(s => s.demoMode);
  const thumbnailFormat = useSettingsStoreSelector(s => s.thumbnailFormat);

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!imageUrl) return;

    setReady(false);

    const id = setTimeout(() => {
      setReady(true);
    }, Math.random() * 25); // random delay between 25 and 50 ms to avoid all images loading at the same time

    return () => clearTimeout(id);
  }, [imageUrl]);

  if (!imageUrl || !ready) return null;

  const src = original ? imageUrlFunc(`${imageObj.folder}/${imageObj.title}`, demoMode) : thumbnailUrl(imageUrl, demoMode);

  return (
    <img
      src={src}
      alt=""
      className={className}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      draggable={false}
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

export default React.memo(AlbumPhotoThumbnailBackground);
