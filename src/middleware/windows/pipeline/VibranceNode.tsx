import { Pipette } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Pipette size={16} />,
  label: "Vibrance",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
