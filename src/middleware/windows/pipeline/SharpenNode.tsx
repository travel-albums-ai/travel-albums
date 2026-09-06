import { Slice } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Slice />,
  label: "Sharpen",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
