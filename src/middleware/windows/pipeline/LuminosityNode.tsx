import { Lightbulb } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Lightbulb size={16} />,
  label: "Luminosity",
  min: 0,
  max: 2,
  step: 0.05,
  defaultValue: 0,
});
