import { Stage } from '@/drawers/adjustments/types';

export function runPipeline(img: ImageData, stages: (Stage | null)[]) {
  for (const stage of stages) {
    if (stage) {
      stage(img);
    }
  }
}
