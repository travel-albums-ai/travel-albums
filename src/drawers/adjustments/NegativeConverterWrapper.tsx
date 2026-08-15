import { Box } from '@mui/material';

import AlbumPhotoThumbnailBackgroundNg from '@/components/AlbumPhotoThumbnailBackgroundNg';
import GenericPanel from '@/components/generics/GenericPanel';
import { useNegativeStoreSelector } from '@/context/negativeStore';
import { useSettingsStoreSelector } from '@/context/settingsStore';
import GeneticBreedingGrid from '@/drawers/adjustments/GeneticBreedingGrid';
import NegativeConverterCanvas from '@/drawers/adjustments/NegativeConverterCanvas';
import NegativeConverterPresetSelector from '@/drawers/adjustments/NegativeConverterPresetSelector';
import NegativeConverterToolbox from '@/drawers/adjustments/NegativeConverterToolbox';
import { Adjustments } from '@/drawers/adjustments/types';
import useNegativeConverterState from '@/hooks/useNegativeConverterState';
import { composeUrl } from '@/lib/thumbnailService';
import { useState } from 'react';
import { ReactCompareSlider } from 'react-compare-slider';

type NegativeConverterWrapperProps = {
  previewPhotoObj: any;
  url: string;
  initialPreset?: Partial<Adjustments>;
  hasToolbox?: boolean;
  hasPresetSelector?: boolean;
  sxCanvas?: Record<string, unknown>;
  hasGeneticBreeding?: boolean;
};

export default function NegativeConverterWrapper({
  previewPhotoObj,
  url,
  initialPreset,
  hasToolbox,
  hasPresetSelector,
  sxCanvas,
  hasGeneticBreeding,
}: NegativeConverterWrapperProps) {
  const { adj, applyPreset, pipeline, preset, presets, set } = useNegativeConverterState({ initialPreset });
  useSettingsStoreSelector(s => s.demoMode);
  const showGenetic = useNegativeStoreSelector((state) => state.showGenetic)

  const [selectedAdj, setSelectedAdj] = useState<Adjustments | null>(null);

  return (
    <GenericPanel id="adjustments-drawer" defaultTool>
      <Box id="negative-converter-wrapper"
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
              itemTwo={<NegativeConverterCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj, true)} />}
            />
          </Box>
        </Box>}

        {/* {!(hasGeneticBreeding && showGenetic) && <> */}
        {hasPresetSelector || hasToolbox ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, overflow: 'auto' }}>
            {hasPresetSelector && <NegativeConverterPresetSelector onChange={applyPreset} previewPhotoObj={previewPhotoObj} preset={preset} presets={presets} />}
            {hasToolbox && <NegativeConverterToolbox adj={selectedAdj || adj} set={set} />}
          </Box>
        ) : null}
        {/* </>} */}
      </Box>
    </GenericPanel>
  );
}
