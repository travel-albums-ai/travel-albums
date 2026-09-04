import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "🎨",
  label: "Saturation",
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
});
