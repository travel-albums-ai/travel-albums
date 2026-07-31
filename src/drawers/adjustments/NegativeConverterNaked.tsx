
import NegativeConverterCanvas from '@/drawers/adjustments/NegativeConverterCanvas';
import { Adjustments } from '@/drawers/adjustments/types';
import useNegativeConverterState from '@/hooks/useNegativeConverterState';

type NegativeConverterWrapperProps = {
  url: string;
  initialPreset?: Partial<Adjustments>;
  sxCanvas?: Record<string, unknown>;
};

export default function NegativeConverterNaked({
  url,
  initialPreset,
  sxCanvas,
}: NegativeConverterWrapperProps) {
  const { pipeline } = useNegativeConverterState({ initialPreset });

  return (
    <NegativeConverterCanvas pipeline={pipeline} url={url} sx={sxCanvas || { width: '600px', height: '400px' }} />
  );
}
