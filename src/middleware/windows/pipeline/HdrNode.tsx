import { Mountain } from 'lucide-react';
import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: <Mountain />,
  label: "HDR Effect",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
