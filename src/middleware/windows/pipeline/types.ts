export type ImageValue = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

// Every node passes around an array of photos so the whole
// pipeline can process a batch in parallel.
export type ImageArray = ImageValue[];

export type NodeInputs = Record<string, unknown>;
export type NodeOutputs = Record<string, unknown>;

export type PipelineNodeDefinition = {
  execute: (inputs: NodeInputs) => Promise<NodeOutputs>;
};
