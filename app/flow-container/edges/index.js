export const generateEdges = (relationships, nodes) => {
  return relationships?.map((relationship) => {
    const sourceNode = nodes.find((node) => node.id === relationship.source);
    const targetNode = nodes.find((node) => node.id === relationship.target);

    if (sourceNode && targetNode) {
      return {
        id: `${relationship.source}-${relationship.target}-${relationship.sourceField}-${relationship.targetField}`,
        source: relationship.source,
        target: relationship.target,
        type: 'smoothstep',
        // label: `${relationship.sourceField} - ${relationship.targetField}`,
        data: {
          relationType: relationship.relationType,
          confidence: relationship.confidence
        }
      };
    }
    return null;
  }).filter(edge => edge !== null);
};