import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  icon: "🌇",
  label: "HDR Effect",
  min: 0,
  max: 100,
  step: 1,
  defaultValue: 0,
});
