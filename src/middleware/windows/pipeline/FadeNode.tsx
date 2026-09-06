import { EyeDashed } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <EyeDashed />,
  label: "Fade",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
