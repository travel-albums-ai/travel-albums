import { useSettings, useSettingsStoreSelector } from '@/context/settingsStore';
import AlbumMapPanelByBatches from '@/drawers/globe/AlbumMapPanelByBatches';
import useRelevantAlbumsByProximity from '@/hooks/useRelevantAlbumsByProximity';
import { GalleryPhoto } from '@/lib/galleryData';
import { thumbnailUrl } from '@/lib/thumbnailService';
import { Box } from '@mui/material';
import { Fragment, useEffect, useRef, useState } from 'react';


export default function AlbumGlobe({ photos, multiplier = 1 }: { photos: GalleryPhoto[], multiplier: number }) {
  const { setPreviewPhotoObj } = useSettings()
  const previewPhotoId = useSettingsStoreSelector((state) => state.previewPhotoObj?.id)
  const mapShowPreview = useSettingsStoreSelector((state) => state.mapShowPreview);

  const [viewport, setViewport] = useState({
    north: -90,
    south: 90,
    east: 180,
    west: -180,
    zoom: 0,
  });

  useEffect(() => {
    localStorage.setItem('albumGlobeViewport', JSON.stringify(viewport));
  }, [viewport]);

  const batches = useRelevantAlbumsByProximity(photos, viewport, multiplier);

  const thumbnailRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (!previewPhotoId) return;

    const selected = thumbnailRefs.current[previewPhotoId];

    if (selected) {
      selected.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [previewPhotoId]);


  return (
    <>
      <Box
        sx={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {photos && <AlbumMapPanelByBatches
          viewport={viewport}
          setViewport={setViewport}
          allPhotos={photos}
          batches={batches}
          onPreview={(photo: GalleryPhoto) => {
            setPreviewPhotoObj(photo)
          }}
        />}

        {mapShowPreview && <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            p: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            alignItems: 'flex-end',
            overflowX: 'auto',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            zIndex: 999,

            '&::-webkit-scrollbar': {
              height: 8,
            },
          }}
        >
          {batches.map((batch: any) => (
            <Fragment key={batch.batchName}>
              {batch.photos.map((p: any) => {
                const selected = previewPhotoId === p.id;

                return (
                  <Box
                    key={p.id}
                    ref={(el) => {
                      thumbnailRefs.current[p.id] = el;
                    }}
                    sx={{
                      flexShrink: 0,
                      boxShadow: selected ? 4 : 2,
                      borderRadius: 1,
                      lineHeight: 0,
                      cursor: 'pointer',
                      border: selected ? '2px solid' : '1px solid',
                      borderColor: (theme) =>
                        selected
                          ? theme.palette.primary.main
                          : theme.palette.divider,
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <img
                      src={thumbnailUrl(p.id)}
                      draggable={false}
                      style={{
                        width: selected ? 200 : 90,
                        height: selected ? 200 : 90,
                        objectFit: 'cover',
                        borderRadius: 4,
                        lineHeight: 0,
                        transition: 'all 0.3s ease',
                        display: 'block',
                        userSelect: 'none',
                      }}
                      onClick={() => {
                        setPreviewPhotoObj(p)
                      }}
                      onMouseOver={(e) => {
                        if (e.shiftKey) {
                          setPreviewPhotoObj(p)
                        }
                      }}
                    />
                  </Box>
                );
              })}
            </Fragment>
          ))}
        </Box>}
      </Box>
    </>
  );
}
