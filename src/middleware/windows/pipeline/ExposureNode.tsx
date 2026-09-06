import { Sun } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Sun />,
  label: "Exposure",
  min: -3,
  max: 3,
  step: 0.1,
  defaultValue: 0,
});
