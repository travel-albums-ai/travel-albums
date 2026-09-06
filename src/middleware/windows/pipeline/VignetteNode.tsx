import { Theater } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Theater size={16} />,
  label: "Vignette",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
