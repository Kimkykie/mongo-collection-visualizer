import React from 'react';
import {
  ReactFlowProvider,
} from 'reactflow';
import FlowContainer from '../flow-container/Flowcontainer';


const SchemaFlowVisualizer: React.FC = () => (
  <ReactFlowProvider>
    <FlowContainer />
  </ReactFlowProvider>
);

export default SchemaFlowVisualizer;