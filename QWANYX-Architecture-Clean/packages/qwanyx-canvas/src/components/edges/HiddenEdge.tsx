import React from 'react';
import { EdgeProps } from 'reactflow';

// Hidden edge component that renders nothing but maintains edge state
export const HiddenEdge: React.FC<EdgeProps> = () => {
  return null;
};