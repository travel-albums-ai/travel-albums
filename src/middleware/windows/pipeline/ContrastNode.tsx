import { Contrast } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Contrast />,
  label: "Contrast",
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
});
