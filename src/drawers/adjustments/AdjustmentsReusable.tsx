import AdjustmentsCanvas from '@/drawers/adjustments/AdjustmentsCanvas';
import { Adjustments } from '@/drawers/adjustments/types';
import useAdjustmentsState from '@/hooks/useAdjustmentsState';
import { composeUrl } from '@/lib/thumbnailService';

type AdjustmentsReusableProps = {
  previewPhotoObj: any;
  initialPreset?: Partial<Adjustments>;
};

export default function AdjustmentsReusable({
  previewPhotoObj,
  initialPreset,
}: AdjustmentsReusableProps) {
  const { pipeline } = useAdjustmentsState({ initialPreset });
  return (
    <AdjustmentsCanvas pipeline={pipeline} url={composeUrl(previewPhotoObj)} />
  );
}
