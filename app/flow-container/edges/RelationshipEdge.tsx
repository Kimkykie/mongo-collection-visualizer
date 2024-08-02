// RelationshipEdge.tsx
import React, { useMemo } from 'react';
import { EdgeProps, getSmoothStepPath } from 'reactflow';

const RelationshipEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const edgeStyle = useMemo(() => {
    const defaultColor = '#b1b1b7';
    const highlightColor = '#22c55e';
    const defaultWidth = 1;
    const highlightWidth = 2;

    return {
      stroke: data?.isHighlighted ? highlightColor : defaultColor,
      strokeWidth: data?.isHighlighted ? highlightWidth : defaultWidth,
    };
  }, [data?.isHighlighted]);

  return (
    <>
      <defs>
        <marker
          id={`dot-${id}`}
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <circle cx="5" cy="5" r="4" fill={edgeStyle.stroke} />
        </marker>
      </defs>
      <path
        id={id}
        style={{...style, ...edgeStyle}}
        className="react-flow__edge-path"
        d={edgePath}
        markerStart={`url(#dot-${id})`}
        markerEnd={`url(#dot-${id})`}
      />
      <path
        d={edgePath}
        strokeWidth={20}
        stroke="transparent"
        fill="none"
        className="react-flow__edge-interaction"
      />
    </>
  );
};

export default RelationshipEdge;