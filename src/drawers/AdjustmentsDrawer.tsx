import { useSettingsStoreSelector } from '@/context/settingsStore';
import NegativeConverterWrapper from '@/drawers/adjustments/NegativeConverterWrapper';
import { composeUrl } from '@/lib/thumbnailService';


export default function AdjustmentsDrawer() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <>
    {previewPhotoObj && <NegativeConverterWrapper previewPhotoObj={previewPhotoObj} url={composeUrl(previewPhotoObj)} hasToolbox={true} hasPresetSelector={true} hasGeneticBreeding={true} />}
  </>
}
