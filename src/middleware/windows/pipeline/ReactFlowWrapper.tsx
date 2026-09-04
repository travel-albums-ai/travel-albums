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
import { evaluatePipeline } from "./evaluatePipeline";

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
