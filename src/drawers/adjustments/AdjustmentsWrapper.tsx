import { Box } from '@mui/material';

import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import GenericPanel from '@/components/generics/GenericPanel';
import Histogram from '@/components/Histogram';
import { useAdjustmentsStoreSelector } from '@/context/adjustmentsStore';
import GeneticBreedingGrid from '@/drawers/adjustments/GeneticBreedingGrid';
import AdjustmentsCanvas from '@/drawers/adjustments/AdjustmentsCanvas';
import AdjustmentsPresetSelector from '@/drawers/adjustments/AdjustmentsPresetSelector';
import AdjustmentsToolbox from '@/drawers/adjustments/AdjustmentsToolbox';
import { Adjustments } from '@/drawers/adjustments/types';
import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import { composeUrl } from '@/lib/thumbnailService';
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

  const [selectedAdj, setSelectedAdj] = useState<Adjustments | null>(null);

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
              // url={imageUrl(`${previewPhotoObj.folder}/${previewPhotoObj.title}`, false)}
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
              itemOne={<AlbumPhotoThumbnailBackgroundNg photo={previewPhotoObj} original={true} />}
              itemTwo={<AdjustmentsCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj, true)} />}
            />
          </Box>
        </Box>}

        {hasPresetSelector || hasToolbox ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
            <Histogram imageUrl={composeUrl(previewPhotoObj)} width={100} height={50} />
            {hasToolbox && <AdjustmentsToolbox adj={selectedAdj || adj} set={set} >
              {hasPresetSelector && <AdjustmentsPresetSelector onChange={applyPreset} previewPhotoObj={previewPhotoObj} preset={preset} presets={presets} />}
            </AdjustmentsToolbox>}
          </Box>
        ) : null}
      </Box>
    </GenericPanel>
  );
}
