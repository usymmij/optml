"use client";

import Dagre from "dagre";
import SideDefault from "./nodes/side-default";
import SideInput from "./nodes/side-input";
import SideOutput from "./nodes/side-output";
import { useState, useCallback, DragEvent, useRef, useEffect } from "react";
import useStore from "@/lib/store";
import type { Edge, NodeTypes, Node } from "reactflow";
import ReactFlow, {
  Background,
  useReactFlow,
  ReactFlowInstance,
} from "reactflow";
import "reactflow/dist/base.css";
import "@/lib/styles/flow.css";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes: NodeTypes = {
  "side-input": SideInput,
  "side-default": SideDefault,
  "side-output": SideOutput,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
  g.setGraph({ rankdir: "LR" });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) => g.setNode(node.id, node));

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const { x, width, y, height } = g.node(node.id);
      return { ...node, position: { x: x - width / 2, y: y - height / 2 } };
    }),
    edges,
  };
};

function Flow() {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { fitView } = useReactFlow();
  const [rfInstance, setRfInstance] = useState<ReactFlowInstance | null>(null);
  const {
    nodes,
    edges,
    setNodes,
    setEdges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useStore();

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log(flow);
    }
  }, [rfInstance]);

  const getId = useCallback(() => {
    return `${nodes.length + 1}`;
  }, [nodes]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();

    if (event.dataTransfer === null) return;
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      if (!reactFlowWrapper.current) return;

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData("application/reactflow");

      // check if the dropped element is valid
      if (typeof type === "undefined" || !type || !rfInstance) {
        return;
      }

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = getId();

      const node: Node = {
        id,
        type,
        position,
        data: {
          label: `Node ${id}`,
        },
      };

      setNodes([...nodes, node]);
    },
    [rfInstance, getId, setNodes, nodes]
  );

  const onLayout = useCallback(() => {
    const layouted = getLayoutedElements(nodes, edges);

    setNodes([...layouted.nodes]);
    setEdges([...layouted.edges]);

    window.requestAnimationFrame(() => {
      fitView();
    });
  }, [nodes, edges, fitView, setNodes, setEdges]);

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        if (e.key === "s") {
          e.preventDefault();
          onSave();
        }
      }
    };

    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [onSave]);

  return (
    <div ref={reactFlowWrapper} className="h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        proOptions={{
          hideAttribution: true,
        }}
        onInit={setRfInstance}
        fitView
      >
        <Background />
      </ReactFlow>
    </div>
  );
}

export default Flow;
