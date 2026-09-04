import type { Edge, Node } from "@xyflow/react";

import type { ImageValue, NodeOutputs, PipelineNodeDefinition } from "./types";

// ============================================================
// Utility: load a File as an HTMLImageElement
// ============================================================

function loadImage(file: File): Promise<ImageValue> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);

    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);

      resolve({
        image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    image.src = url;
  });
}

// ============================================================
// Node implementations
// ============================================================

const nodeDefinitions: Record<
  string,
  PipelineNodeDefinition
> = {
  source: {
    async execute(inputs) {
      const file = inputs.file as File | undefined;

      if (!file) {
        return {
          image: null,
        };
      }

      const image = await loadImage(file);

      return {
        image,
      };
    },
  },

  invert: {
    async execute(inputs) {
      const source = inputs.image as ImageValue | null;

      if (!source) {
        return {
          image: null,
        };
      }

      // Pretend this is expensive.
      // In reality this could be WebGPU, WASM, AI, etc.
      await new Promise((resolve) =>
        setTimeout(resolve, 100)
      );

      const canvas = document.createElement("canvas");

      canvas.width = source.width;
      canvas.height = source.height;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        throw new Error("Could not create canvas context");
      }

      ctx.drawImage(source.image, 0, 0);

      const pixels = ctx.getImageData(
        0,
        0,
        canvas.width,
        canvas.height
      );

      for (let i = 0; i < pixels.data.length; i += 4) {
        pixels.data[i] = 255 - pixels.data[i];
        pixels.data[i + 1] =
          255 - pixels.data[i + 1];
        pixels.data[i + 2] =
          255 - pixels.data[i + 2];
      }

      ctx.putImageData(pixels, 0, 0);

      const inverted = new Image();

      inverted.src = canvas.toDataURL("image/png");

      await inverted.decode();

      return {
        image: {
          image: inverted,
          width: canvas.width,
          height: canvas.height,
        },
      };
    },
  },

  viewer: {
    async execute(inputs) {
      // Viewer is technically a pipeline node too.
      // It simply receives the image.

      await Promise.resolve();

      return {
        image: inputs.image ?? null,
      };
    },
  },
};

// ============================================================
// Pipeline evaluator
// ============================================================

export async function evaluatePipeline(
  nodes: Node[],
  edges: Edge[]
) {
  const outputs = new Map<
    string,
    Promise<NodeOutputs>
  >();

  const evaluateNode = (
    nodeId: string
  ): Promise<NodeOutputs> => {
    // Already evaluating?
    const existing = outputs.get(nodeId);

    if (existing) {
      return existing;
    }

    const node = nodes.find(
      (n) => n.id === nodeId
    );

    if (!node) {
      return Promise.reject(
        new Error(`Node ${nodeId} not found`)
      );
    }

    const definition =
      nodeDefinitions[node.type ?? ""];

    if (!definition) {
      return Promise.reject(
        new Error(
          `No definition for ${node.type}`
        )
      );
    }

    const promise = (async () => {
      const incoming = edges.filter(
        (edge) => edge.target === nodeId
      );

      const inputEntries =
        await Promise.all(
          incoming.map(async (edge) => {
            const upstream =
              await evaluateNode(edge.source);

            return [
              edge.targetHandle ?? "input",
              upstream[
                edge.sourceHandle ?? "output"
              ],
            ] as const;
          })
        );

      const inputs =
        Object.fromEntries(inputEntries);

      // Special case:
      // Source node gets its File from node.data.
      if (node.type === "source") {
        inputs.file = node.data.file;
      }

      console.log(
        `▶ executing ${node.id}`
      );

      const result =
        await definition.execute(inputs);

      console.log(
        `✓ completed ${node.id}`
      );

      return result;
    })();

    outputs.set(nodeId, promise);

    return promise;
  };

  // Evaluate every node.
  await Promise.all(
    nodes.map((node) =>
      evaluateNode(node.id)
    )
  );

  return outputs;
}
