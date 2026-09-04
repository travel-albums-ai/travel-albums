import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "🎚️",
  label: "Gamma",
  min: 0.1,
  max: 3,
  step: 0.01,
  defaultValue: 1,
});
