// flow-container/types/nodes.ts
import { Node, Edge } from 'reactflow';
import { Field } from './collections';

export interface FlowNodeData {
  label: string;
  fields: Record<string, Field>;
  recordCount: number;
}

export type FlowNode = Node<FlowNodeData>;

export interface FlowEdgeData {
  confidence: number;
}

export type FlowEdge = Edge<FlowEdgeData>;

export interface FlowData {
  nodes: FlowNode[];
  edges: FlowEdge[];
}