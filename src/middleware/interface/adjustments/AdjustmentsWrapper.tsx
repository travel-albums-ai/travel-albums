import { Box } from '@mui/material';

import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import GenericPanel from '@/components/generics/GenericPanel';
import Histogram from '@/components/Histogram';
import { useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import { composeUrl } from '@/lib/thumbnailService';
import AdjustmentsCanvas from '@/middleware/interface/adjustments/AdjustmentsCanvas';
import AdjustmentsPresetSelector from '@/middleware/interface/adjustments/AdjustmentsPresetSelector';
import AdjustmentsToolbox from '@/middleware/interface/adjustments/AdjustmentsToolbox';
import GeneticBreedingGrid from '@/middleware/interface/adjustments/GeneticBreedingGrid';
import ImageUrlToBase64 from '@/middleware/interface/adjustments/ImageUrlToBase64';
import { Adjustments } from '@/middleware/interface/adjustments/types';
import AIColorizer from '@/robot/AIColorizer';
import { useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

type AdjustmentsWrapperProps = {
  previewPhotoObj: any;
  url: string;
  initialPreset?: Partial<Adjustments>;
  hasToolbox?: boolean;
  hasPresetSelector?: boolean;
  sxCanvas?: Record<string, unknown>;
  hasGeneticBreeding?: boolean;
};

async function imageUrlToBase64(url: string): Promise<string> {
  const image = new Image();

  image.crossOrigin = 'anonymous';

  image.src = url;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error('Failed to load image'));
  });

  const canvas = document.createElement('canvas');

  canvas.width = image.naturalWidth;
  canvas.height = image.naturalHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not create canvas context');
  }

  ctx.drawImage(image, 0, 0);

  return canvas.toDataURL('image/jpeg', 0.95);
}

export default function AdjustmentsWrapper({
  previewPhotoObj,
  url,
  initialPreset,
  hasToolbox,
  hasPresetSelector,
  sxCanvas,
  hasGeneticBreeding,
}: AdjustmentsWrapperProps) {
  const { adj, applyPreset, pipeline, preset, presets, set } = useAdjustmentsState({ initialPreset });
  const showGenetic = useAdjustmentsStoreSelector((state) => state.showGenetic)
  const processedBase64 = useAdjustmentsStoreSelector((state) => state.processedBase64)

  const [selectedAdj, setSelectedAdj] = useState<Adjustments | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);

  const processImage = async (url: string) => {
    return await imageUrlToBase64(composeUrl(previewPhotoObj, true)).then((base64) => base64);
  };

  // const base64Image = await imageUrlToBase64(composeUrl(previewPhotoObj, true));

  return (
    <GenericPanel id="adjustments-drawer" defaultTool>
      <Box id="adjustments-wrapper"
        sx={{
          alignItems: 'stretch',
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 2,
          overflow: 'hidden',
          width: '100%',
        }}
      >

        {(hasGeneticBreeding && showGenetic) ? (
          <Box
            sx={{
              display: 'flex',
              flex: '0 0 50%',
              height: '0',
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <GeneticBreedingGrid
              propagateSelection={(adj) => setSelectedAdj(adj)}
              key={JSON.stringify(adj)}
              url={url}
              basePreset={adj}
            />
          </Box>
        ) :  <Box
          sx={{
            display: 'flex',
            flex: '0 0 50%',
            height: '0',
            overflow: 'hidden',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 2,
            boxShadow: 2,
          }}
        >
          <Box
            sx={{
              aspectRatio: previewPhotoObj.width / previewPhotoObj.height * -1, // or 4/3, 16/9...
              maxWidth: '100%',
            }}
          >
            <ReactCompareSlider
              itemOne={<AlbumPhotoThumbnailBackgroundNg photo={previewPhotoObj} original={false} />}
              // itemTwo={<AdjustmentsCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj, true)} />}
              itemTwo={<Box
                component="img"
                src={processedBase64}
                alt="Colorized"
                sx={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  borderRadius: 2,
                }}
              />}
            />
          </Box>
        </Box>}

        <AdjustmentsCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj, false)} />

        <ImageUrlToBase64 imageUrl={composeUrl(previewPhotoObj, false)} />
        <AIColorizer />

        {(hasPresetSelector || hasToolbox) &&
          <AdjustmentsToolbox
            adj={selectedAdj || adj}
            set={set}
            histogram={<Histogram imageUrl={composeUrl(previewPhotoObj)} width={160} height={80} />}
            presetSelector={hasPresetSelector ? <AdjustmentsPresetSelector onChange={applyPreset} previewPhotoObj={previewPhotoObj} preset={preset} presets={presets} /> : undefined}
          />
        }
      </Box>
    </GenericPanel>
  );
}
