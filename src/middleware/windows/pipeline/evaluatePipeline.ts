import type { Edge, Node } from "@xyflow/react";

import type { Stage } from "../../interface/adjustments/types";
import { invertStage } from "../../interface/adjustments/utils";
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
// Utility: render a source image onto a canvas, optionally
// applying a per-pixel transform, and return the result.
// ============================================================

async function renderImage(
  source: ImageValue,
  draw: (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => void,
  transformPixels?: Stage
): Promise<ImageValue> {
  const canvas = document.createElement("canvas");

  canvas.width = source.width;
  canvas.height = source.height;

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create canvas context");
  }

  draw(ctx, canvas);

  if (transformPixels) {
    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    transformPixels(pixels);

    ctx.putImageData(pixels, 0, 0);
  }

  const result = new Image();

  result.src = canvas.toDataURL("image/png");

  await result.decode();

  return {
    image: result,
    width: canvas.width,
    height: canvas.height,
  };
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

      if (!file) { return { image: null } }

      const image = await loadImage(file);

      return { image };
    },
  },

  invert: {
    async execute(inputs) {
      const source = inputs.image as ImageValue | null;

      if (!source) { return { image: null } }

      const image = await renderImage(
        source,
        (ctx) => ctx.drawImage(source.image, 0, 0),
        invertStage()
      );

      return { image };
    },
  },

  flip: {
    async execute(inputs) {
      const source = inputs.image as ImageValue | null;

      if (!source) { return { image: null } }

      const image = await renderImage(
        source,
        (ctx, canvas) => {
          // Rotate 180deg around the canvas center.
          ctx.translate(canvas.width, canvas.height);
          ctx.rotate(Math.PI);
          ctx.drawImage(source.image, 0, 0);
        }
      );

      return { image };
    },
  },

  viewer: {
    async execute(inputs) {
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
