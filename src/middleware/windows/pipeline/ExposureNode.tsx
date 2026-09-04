import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "📸",
  label: "Exposure",
  min: -3,
  max: 3,
  step: 0.1,
  defaultValue: 0,
});
