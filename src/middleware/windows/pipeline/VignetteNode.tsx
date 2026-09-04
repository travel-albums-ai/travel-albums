import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "⚫",
  label: "Vignette",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
