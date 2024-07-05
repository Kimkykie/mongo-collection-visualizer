import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';
import { generateNodes } from './nodes/util';
import { generateEdges } from './edges/index';

const FlowContainer = ({ collections, relationships }) => {
  const nodeTypes = useMemo(() => ({
    collection: CollectionNode,
  }), []);

  const edgeTypes = useMemo(() => ({}), []);

  const generateNodesCallback = useCallback(() => generateNodes(collections, relationships), [collections, relationships]);
  const generateEdgesCallback = useCallback((nodes) => generateEdges(relationships, nodes), [relationships]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generateNodesCallback());
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

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

const SchemaFlowVisualizer = ({ collections, relationships }) => {
  return (
    <ReactFlowProvider>
      <FlowContainer collections={collections} relationships={relationships} />
    </ReactFlowProvider>
  );
}

export default SchemaFlowVisualizer;
