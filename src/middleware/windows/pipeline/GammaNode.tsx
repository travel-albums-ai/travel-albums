import { Palette } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Palette size={16} />,
  label: "Gamma",
  min: 0.1,
  max: 3,
  step: 0.01,
  defaultValue: 1,
});
