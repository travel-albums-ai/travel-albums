import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import { Box } from '@mui/material';
import { useEffect, useState } from 'react';

type ViewerProps = {
  photo: any;
};

type Layer = {
  photo: any;
  key: string;
};

const getPhotoKey = (photo: any) => photo?.id ?? photo?.path;

export default function LightboxBackground({ photo }: ViewerProps) {
  const [layers, setLayers] = useState<Layer[]>(() =>
    photo
      ? [{ photo, key: getPhotoKey(photo) }]
      : [],
  );

  useEffect(() => {
    if (!photo) {
      setLayers([]);
      return;
    }

    const key = getPhotoKey(photo);

    if (layers.some(layer => layer.key === key)) {
      return;
    }

    // Keep the current image and mount the new one underneath it.
    setLayers(current => [
      ...current.slice(-1),
      {
        photo,
        key,
      },
    ]);
  }, [photo, layers]);

  useEffect(() => {
    if (layers.length < 2) return;

    const timeout = window.setTimeout(() => {
      setLayers(current => current.slice(-1));
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [layers]);

  if (!layers.length) return null;

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        borderRadius: 4,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {layers.map((layer, index) => {
        const isCurrent = index === layers.length - 1;

        return (
          <Box
            key={layer.key}
            sx={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              opacity: isCurrent ? 0.25 : 0,
              filter: 'blur(12px) saturate(1.75)',
              transition: 'opacity 350ms ease-in-out',
            }}
          >
            <AlbumPhotoThumbnailBackgroundNg
              photo={layer.photo}
              original={true}
              style={{
                width: '100%',
                height: '100%',
              }}
            />
          </Box>
        );
      })}
    </Box>
  );
}
