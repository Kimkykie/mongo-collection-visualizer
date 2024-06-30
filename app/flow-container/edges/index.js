export const generateEdges = (collections, nodes) => {
  const edges = [];
  collections?.forEach((collection) => {
    collection?.relationships?.forEach((relationship) => {

      const sourceNode = nodes.find((node) => node.id === relationship.source);
      const targetNode = nodes.find((node) => node.id === relationship.target);

      if (sourceNode && targetNode) {
        const sourcePosition = relationship.sourcePosition || calculateSourcePosition(sourceNode.width, sourceNode.position.x, targetNode.width, targetNode.position.x);
        const targetPosition = relationship.targetPosition || calculateTargetPosition(sourceNode.width, sourceNode.position.x, targetNode.width, targetNode.position.x);

        const sourceHandle = `${relationship.sourceKey}-${sourcePosition}`;
        const targetHandle = `${relationship.targetKey}-${targetPosition}`;

        edges.push({
          id: `${relationship.source}-${relationship.target}`,
          source: relationship.source,
          target: relationship.target,
          type: 'smoothstep',
          sourceHandle,
          targetHandle,
          sourceKey: relationship.sourceKey,
          targetKey: relationship.targetKey,
        });
      }
    });
  });
  return edges;
};

export const calculateSourcePosition = (
  sourceNodeWidth,
  sourceNodeX,
  targetNodeWidth,
  targetNodeX,
) => {
  if (sourceNodeX > (targetNodeX + targetNodeWidth)) {
    return "left";
  } else if (sourceNodeX > targetNodeX && sourceNodeX < (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if ((sourceNodeX + sourceNodeWidth) > targetNodeX) {
    return "left";
  } else {
    return "right";
  }
};


export const calculateTargetPosition = (
  sourceNodeWidth,
  sourceNodeX,
  targetNodeWidth,
  targetNodeX,
) => {
  if (sourceNodeX > (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if (sourceNodeX > targetNodeX && sourceNodeX < (targetNodeX + targetNodeWidth)) {
    return "right";
  } else if ((sourceNodeX + sourceNodeWidth) > targetNodeX) {
    return "left";
  } else {
    return "left";
  }
};
