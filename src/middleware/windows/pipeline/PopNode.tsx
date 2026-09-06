import { Gem } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Gem size={16} />,
  label: "Pop",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
