import { createSliderNode } from "./AdjustmentSliderNode";

export default createSliderNode({
  min: 0,
  max: 360,
  step: 1,
  defaultValue: 0,
  type: "rotate",
});
