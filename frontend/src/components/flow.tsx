"use client";

import { v4 as uuidv4 } from "uuid";
import Dagre from "dagre";
import DataInput from "./nodes/data-input";
import Dense from "./nodes/dense";
import Conv1D from "./nodes/conv-1d";
import Conv2D from "./nodes/conv-2d";
import Conv3D from "./nodes/conv-3d";
import Normalization from "./nodes/normalization";
import BatchNormalization from "./nodes/batch-normalization";
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
import FlowMenubar from "./flow-menubar";
import FlowActions from "./flow-actions";
import { useToast } from "./ui/use-toast";
import { defaultNodeData } from "@/lib/nodes";

const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

const nodeTypes: NodeTypes = {
  "data-input": DataInput,
  dense: Dense,
  normalization: Normalization,
  "batch-normalization": BatchNormalization,
  conv1d: Conv1D,
  conv2d: Conv2D,
  conv3d: Conv3D,
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
  const { toast } = useToast();
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
      toast({
        title: "Flow saved",
        description: "Your flow has been saved.",
        duration: 3000,
      });
    }
  }, [rfInstance, toast]);

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

      if (type === "data-input") {
        if (nodes.some((node) => node.type === "data-input")) {
          toast({
            title: "Data input already exists",
            description: "You can only have one data input node.",
            duration: 3000,
          });
          return;
        }
      }

      const position = rfInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const node: Node = {
        id: uuidv4(),
        type,
        position,
        data: defaultNodeData[type],
      };

      setNodes([...nodes, node]);
    },
    [rfInstance, setNodes, toast, nodes]
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
      <FlowMenubar onSave={onSave} className="z-10" />
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
      <FlowActions onLayout={onLayout} onRun={onSave} className="z-10" />
    </div>
  );
}

export default Flow;
