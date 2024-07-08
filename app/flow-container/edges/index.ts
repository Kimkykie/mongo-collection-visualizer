import { Edge } from 'reactflow';
import { FlowNode } from '../types/nodes';
import { Relationship } from '../types/relationships';

// Define FlowEdge type here to ensure consistency
export type FlowEdge = Edge<{
  confidence: number;
}>;

export const generateEdges = (relationships: Relationship[], nodes: FlowNode[]): FlowEdge[] => {
  return relationships
    .filter((relationship) => {
      const sourceNode = nodes.find((node) => node.id === relationship.source);
      const targetNode = nodes.find((node) => node.id === relationship.target);
      return sourceNode && targetNode;
    })
    .map((relationship): FlowEdge => {
      return {
        id: `${relationship.source}-${relationship.target}-${relationship.sourceField}-${relationship.targetField}`,
        source: relationship.source,
        target: relationship.target,
        type: 'smoothstep',
        data: {
          confidence: relationship.confidence
        }
      };
    });
};