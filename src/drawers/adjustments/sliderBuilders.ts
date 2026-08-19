import { ReactNode } from 'react';

import { AdjustmentsSlider } from '@/drawers/adjustments/AdjustmentsItem';
import { RGB } from '@/drawers/adjustments/types';

export function numberSlider({
  label,
  max,
  min,
  scale,
  onValueChange,
  preIcon,
  skipLabel,
  step,
  value,
  defaultValue,
}: {
  label: string;
  max: number;
  min: number;
  onValueChange: (value: number) => void;
  preIcon?: ReactNode;
  skipLabel?: boolean;
  step?: number;
  scale?: number;
  value: number;
  defaultValue?: number;
}): AdjustmentsSlider {
  return {
    label,
    max,
    min,
    onChange: (_event, sliderValue) => onValueChange(sliderValue as number),
    preIcon,
    skipLabel,
    step,
    scale,
    value,
    defaultValue,
  };
}

export function rgbSliders({
  color,
  label,
  onColorChange,
}: {
  color: RGB;
  label: string;
  onColorChange: (next: RGB) => void;
}): AdjustmentsSlider[] {
  return [
    numberSlider({
      label,
      max: 255,
      min: 0,
      value: color.r,
      onValueChange: (value) => onColorChange({ ...color, r: value }),
    }),
    numberSlider({
      label,
      max: 255,
      min: 0,
      value: color.g,
      onValueChange: (value) => onColorChange({ ...color, g: value }),
    }),
    numberSlider({
      label,
      max: 255,
      min: 0,
      value: color.b,
      onValueChange: (value) => onColorChange({ ...color, b: value }),
    }),
  ];
}
