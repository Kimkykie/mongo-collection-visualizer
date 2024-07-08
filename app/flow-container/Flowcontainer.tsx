// flow-container/FlowContainer.tsx
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  NodeTypes,
  EdgeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';

import { generateEdges } from './edges';
import { Collection } from './types/collections';
import { Relationship } from './types/relationships';
import { FlowNodeData, FlowEdgeData } from './types/nodes';
import { generateNodes } from './utils/layout';

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
    <div style={{ width: '100%', height: '80vh' }}>
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

export default FlowContainer;