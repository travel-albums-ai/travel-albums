import { useSettingsStoreSelector } from '@/context/settingsStore';
import AdjustmentsWrapper from '@/drawers/adjustments/AdjustmentsWrapper';
import { composeUrl } from '@/lib/thumbnailService';


export default function AdjustmentsDrawer() {
  const previewPhotoObj = useSettingsStoreSelector((state) => state.previewPhotoObj)

  return <>
    {previewPhotoObj && <AdjustmentsWrapper previewPhotoObj={previewPhotoObj} url={composeUrl(previewPhotoObj)} hasToolbox={true} hasPresetSelector={true} hasGeneticBreeding={true} />}
  </>
}
