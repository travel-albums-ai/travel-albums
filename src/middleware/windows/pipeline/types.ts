export type ImageValue = {
  image: HTMLImageElement;
  width: number;
  height: number;
};

export type NodeInputs = Record<string, unknown>;
export type NodeOutputs = Record<string, unknown>;

export type PipelineNodeDefinition = {
  execute: (inputs: NodeInputs) => Promise<NodeOutputs>;
};
