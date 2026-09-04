import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "◐",
  label: "Contrast",
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
});
