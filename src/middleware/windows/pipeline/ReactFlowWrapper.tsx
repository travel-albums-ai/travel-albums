import { Box } from '@mui/material';
import {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import './styles.css';

import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import InvertNode from "./InvertNode";
import SourceNode from "./SourceNode";
import ViewerNode from "./ViewerNode";
import type {
  ImageValue,
  NodeOutputs,
  PipelineNodeDefinition,
} from "./types";

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
// React Flow node registry
// ============================================================

const nodeTypes = {
  source: SourceNode,
  invert: InvertNode,
  viewer: ViewerNode,
};

// ============================================================
// Initial graph
// ============================================================

const initialNodes: Node[] = [
  {
    id: "source",
    type: "source",
    position: {
      x: 50,
      y: 200,
    },
    data: {},
  },

  {
    id: "invert",
    type: "invert",
    position: {
      x: 350,
      y: 200,
    },
    data: {},
  },

  {
    id: "viewer",
    type: "viewer",
    position: {
      x: 650,
      y: 200,
    },
    data: {},
  },
];

const initialEdges: Edge[] = [
  {
    id: "source-invert",
    source: "source",
    sourceHandle: "image",
    target: "invert",
    targetHandle: "image",
  },

  {
    id: "invert-viewer",
    source: "invert",
    sourceHandle: "image",
    target: "viewer",
    targetHandle: "image",
  },
];

// ============================================================
// Pipeline evaluator
// ============================================================

async function evaluatePipeline(
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

// ============================================================
// App
// ============================================================

export default function ReactFlowWrapper() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const evaluationId = useRef(0);

  const evaluate = useCallback(async () => {
    const id = ++evaluationId.current;

    const results =
      await evaluatePipeline(nodes, edges);

    // Don't allow an old evaluation to overwrite
    // a newer graph state.
    if (id !== evaluationId.current) {
      return;
    }

    setNodes((current) =>
      current.map((node) => {
        const result =
          results.get(node.id);

        if (!result) {
          return node;
        }

        // We need to resolve the promise here
        // because React Flow node data itself
        // contains the actual value.
        return node;
      })
    );

    // Update viewer nodes with their resolved result.
    for (const node of nodes) {
      if (node.type !== "viewer") {
        continue;
      }

      const promise = results.get(node.id);

      if (!promise) continue;

      const result = await promise;

      if (
        id !== evaluationId.current
      ) {
        return;
      }

      setNodes((current) =>
        current.map((n) =>
          n.id === node.id
            ? {
              ...n,
              data: {
                ...n.data,
                image: result.image,
              },
            }
            : n
        )
      );
    }
  }, [
    nodes,
    edges,
    setNodes,
  ]);

  // Automatically evaluate whenever
  // the graph changes.
  useEffect(() => {
    // evaluate();
  }, [evaluate]);

  // File selection changes node.data directly,
  // so listen for the explicit pipeline event.
  useEffect(() => {
    const handler = () => {
      evaluate();
    };

    window.addEventListener(
      "pipeline:changed",
      handler
    );

    return () => {
      window.removeEventListener(
        "pipeline:changed",
        handler
      );
    };
  }, [evaluate]);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((current) =>
        addEdge(connection, current)
      );
    },
    [setEdges]
  );

  return (
    <Box className="app" sx={{ width: '100%', height: '100%' }}>
      ddd
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </Box>
  );
}
