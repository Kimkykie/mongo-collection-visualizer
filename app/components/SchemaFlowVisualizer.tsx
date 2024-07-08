import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Collection } from '../flow-container/types/collections';
import { Relationship } from '../flow-container/types/relationships';
import CollectionNode from '../flow-container/nodes/CollectionNode';
import { generateNodes } from '../flow-container/utils/layout';
import { generateEdges } from '../flow-container/edges';
import { FlowNodeData, FlowEdgeData } from '../flow-container/types/nodes';

interface FlowContainerProps {
  collections: Collection[];
  relationships: Relationship[];
}

const FlowContainer: React.FC<FlowContainerProps> = ({ collections, relationships }) => {
  const nodeTypes = useMemo<NodeTypes>(() => ({ collection: CollectionNode }), []);
  const edgeTypes = useMemo<EdgeTypes>(() => ({}), []);

  const generateNodesCallback = useCallback(() => generateNodes(collections, relationships), [collections, relationships]);
  const generateEdgesCallback = useCallback((nodes: Node<FlowNodeData>[]) => generateEdges(relationships, nodes), [relationships]);

  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNodeData>(generateNodesCallback());
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdgeData>([]);

  useEffect(() => {
    setNodes(generateNodesCallback());
  }, [collections, relationships, setNodes, generateNodesCallback]);

  useEffect(() => {
    setEdges(generateEdgesCallback(nodes));
  }, [nodes, relationships, setEdges, generateEdgesCallback]);

  const onLayout = useCallback(() => {
    const newNodes = generateNodesCallback();
    setNodes(newNodes);
    setEdges(generateEdgesCallback(newNodes));
  }, [generateNodesCallback, generateEdgesCallback, setNodes, setEdges]);

  return (
    <div style={{ width: '100%', height: '60vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        fitView
        snapGrid={[16, 16]}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <button onClick={onLayout}>Re-layout</button>
    </div>
  );
};

interface SchemaFlowVisualizerProps {
  collections: Collection[];
  relationships: Relationship[];
}

const SchemaFlowVisualizer: React.FC<SchemaFlowVisualizerProps> = ({ collections, relationships }) => (
  <ReactFlowProvider>
    <FlowContainer collections={collections} relationships={relationships} />
  </ReactFlowProvider>
);

export default SchemaFlowVisualizer;