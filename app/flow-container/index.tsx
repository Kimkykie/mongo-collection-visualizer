import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, ReactFlowProvider, useNodesState, useEdgesState, getOutgoers, getIncomers } from 'reactflow';
import 'reactflow/dist/style.css';
import CollectionNode from './nodes/CollectionNode';
import { generateNodes } from './nodes/util';
import { calculateSourcePosition, calculateTargetPosition, generateEdges } from './edges/index';



const FlowContainer = ({ collections }) => {
  const nodeTypes = useMemo(() => ({
    collection: CollectionNode,
  }), []);

  const initialNodes = generateNodes(collections);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  const initialEdges = generateEdges(collections, nodes);

  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const handleNodesChange = useCallback(
    (nodeChanges) => {
      nodeChanges.forEach(nodeChange => {
        if(nodeChange.type === "position" && nodeChange.positionAbsolute) { // nodeChange.positionAbsolute contains new position
          const node = nodes.find(node => node.id === nodeChange.id);

          if(!node) {
            return;
          }

          const incomingNodes = getIncomers(node, nodes, edges);
          incomingNodes.forEach(incomingNode => {
            const edge = edges.find(edge => {
              return edge.id === `${incomingNode.id}-${node.id}`;
            });


            const edgeConfig = edges.find((edgeConfig) => {
              return edgeConfig.source === incomingNode.id && edgeConfig.target === node.id;
            });

            if(nodeChange.positionAbsolute?.x) {
              setEdges(eds =>
                eds.map(ed => {
                  if(edge && ed.id === edge.id) {

                    const sourcePosition = calculateSourcePosition((incomingNode.width as number), incomingNode.position.x, (node.width as number), nodeChange.positionAbsolute!.x);
                    const targetPosition = calculateTargetPosition((incomingNode.width as number), incomingNode.position.x, (node.width as number), nodeChange.positionAbsolute!.x);

                    const sourceHandle = `${edgeConfig!.sourceKey}-${sourcePosition}`;
                    const targetHandle = `${edgeConfig!.targetKey}-${targetPosition}`;

                    ed.sourceHandle = sourceHandle;
                    ed.targetHandle = targetHandle;

                    console.log(ed)
                  }


                  return ed;
                })
              )
            }


            if(nodeChange.positionAbsolute?.x) {
              setEdges(eds =>
                eds.map(ed => {
                  return ed;
                })
              )
            }
          });

          const outgoingNodes = getOutgoers(node, nodes, edges);
          outgoingNodes.forEach(targetNode => {
            const edge = edges.find(edge => {
              return edge.id === `${node.id}-${targetNode.id}`;
            });
          });
        }
      });

      onNodesChange(nodeChanges);
    },
    [onNodesChange, setEdges, nodes, edges]
  )

  useEffect(() => {
    const newNodes = generateNodes(collections);
    const newEdges = generateEdges(collections, newNodes);

    setNodes(newNodes);
    setEdges(newEdges);
  }, [collections, setNodes, setEdges]);

  return (
    <div style={{ height: '80vh' }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowContainer;
