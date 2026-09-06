import { Wheat } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon:<Wheat size={16} />,
  label: "Grain",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
