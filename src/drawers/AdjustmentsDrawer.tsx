import { useSettingsStoreSelector } from '@/context/settingsStore';
import NegativeConverterWrapper from '@/drawers/adjustments/NegativeConverterWrapper';
import { thumbnailUrl } from '@/lib/thumbnailService';
import 'flexlayout-react/style/alpha_dark.css';

export default function AdjustmentsDrawer() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <>
    {previewPhotoObj && <NegativeConverterWrapper previewPhotoObj={previewPhotoObj} url={thumbnailUrl(previewPhotoObj.id, false)} hasToolbox={true} hasPresetSelector={true} hasGeneticBreeding={true} />}
  </>
}
