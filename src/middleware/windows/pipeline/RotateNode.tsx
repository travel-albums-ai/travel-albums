import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "🔁",
  label: "Rotate",
  min: 0,
  max: 360,
  step: 1,
  defaultValue: 0,
});
