import { Angle } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Angle size={16} />,
  label: "Rotate",
  min: 0,
  max: 360,
  step: 1,
  defaultValue: 0,
});
