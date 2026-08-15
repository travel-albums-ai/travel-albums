
import { useSettingsStoreSelector } from '@/context/settingsStore';
import NegativeConverterCanvas from '@/drawers/adjustments/NegativeConverterCanvas';
import { Adjustments } from '@/drawers/adjustments/types';
import useNegativeConverterState from '@/hooks/useNegativeConverterState';
import { composeUrl } from '@/lib/thumbnailService';

type NegativeConverterWrapperProps = {
  previewPhotoObj: any;
  initialPreset?: Partial<Adjustments>;
};

export default function NegativeConverterReusable({
  previewPhotoObj,
  initialPreset,
}: NegativeConverterWrapperProps) {
  const { pipeline } = useNegativeConverterState({ initialPreset });
  const demoMode = useSettingsStoreSelector(s => s.demoMode);

  return (
    <NegativeConverterCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj, false, demoMode)} />
  );
}
