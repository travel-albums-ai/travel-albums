import { createSliderNode } from '@/middleware/windows/pipeline/AdjustmentSliderNode';
import { Lightbulb } from 'lucide-react';

export default createSliderNode({
  icon: <Lightbulb />,
  label: "Brightness",
  min: -100,
  max: 100,
  step: 1,
  defaultValue: 0,
});
