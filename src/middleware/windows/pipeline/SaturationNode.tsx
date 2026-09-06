import { SwatchBook } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <SwatchBook size={16} />,
  label: "Saturation",
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
});
