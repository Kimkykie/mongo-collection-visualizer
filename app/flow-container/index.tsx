import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';
import { generateNodes } from './nodes/util';
import { generateEdges } from './edges/index';

const FlowContainer = ({ collections }) => {
  const nodeTypes = useMemo(() => ({
    collection: CollectionNode,
  }), []);

  // If you have custom edge types, define and memoize them similarly
  const edgeTypes = useMemo(() => ({}), []);

  const initialNodes = generateNodes(collections);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const initialEdges = generateEdges(collections, nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    const newNodes = generateNodes(collections);
    const newEdges = generateEdges(collections, newNodes);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [collections, setNodes, setEdges]);

  return (
    <div style={{ height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        snapToGrid={true}
        snapGrid={[16, 16]}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

const SchemaFlowVisualizer = ({ collections }) => {
  return (
    <ReactFlowProvider>
      <FlowContainer collections={collections} />
    </ReactFlowProvider>
  );
}

export default SchemaFlowVisualizer;
