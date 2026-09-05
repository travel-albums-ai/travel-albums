export type ImageValue = {
  image: HTMLImageElement;
  width: number;
  height: number;
  // Original GalleryPhoto title / uploaded file name, carried through
  // every pipeline stage so the viewer can export with a sensible name.
  name?: string;
};

// Every node passes around an array of photos so the whole
// pipeline can process a batch in parallel.
export type ImageArray = ImageValue[];

export type NodeInputs = Record<string, unknown>;
export type NodeOutputs = Record<string, unknown>;

export type PipelineNodeDefinition = {
  execute: (inputs: NodeInputs) => Promise<NodeOutputs>;
};
