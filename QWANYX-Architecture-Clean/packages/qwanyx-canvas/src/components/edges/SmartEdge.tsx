import React from 'react';
import { EdgeProps, getBezierPath, BaseEdge, Position } from 'reactflow';

export const SmartEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) => {
  // Adjust connection points to icon center
  // Since handles are at 50%, 50% of node, we need to find the actual icon center
  // The icon is 64px with 6px padding, so it's offset from the node center
  
  // Calculate the angle between source and target
  const dx = targetX - sourceX;
  const dy = targetY - sourceY;
  
  // Determine best connection sides based on relative positions
  let adjustedSourceX = sourceX;
  let adjustedSourceY = sourceY;
  let adjustedTargetX = targetX;
  let adjustedTargetY = targetY;
  let newSourcePos = sourcePosition;
  let newTargetPos = targetPosition;
  
  // If horizontal distance is greater than vertical, use left/right connections
  if (Math.abs(dx) > Math.abs(dy) * 1.5) {
    // Horizontal connection is better
    if (dx > 0) {
      // Target is to the right
      newSourcePos = Position.Right;
      newTargetPos = Position.Left;
      // No adjustment - use center point
    } else {
      // Target is to the left
      newSourcePos = Position.Left;
      newTargetPos = Position.Right;
      // No adjustment - use center point
    }
  } else {
    // Vertical connection is better
    if (dy > 0) {
      // Target is below
      newSourcePos = Position.Bottom;
      newTargetPos = Position.Top;
      // No adjustment - use center point
    } else {
      // Target is above
      newSourcePos = Position.Top;
      newTargetPos = Position.Bottom;
      // No adjustment - use center point
    }
  }
  
  const [edgePath] = getBezierPath({
    sourceX: adjustedSourceX,
    sourceY: adjustedSourceY,
    sourcePosition: newSourcePos,
    targetX: adjustedTargetX,
    targetY: adjustedTargetY,
    targetPosition: newTargetPos,
  });

  // Create a unique gradient ID for this edge
  const gradientId = `edge-gradient-${id}`;
  
  return (
    <>
      <defs>
        <linearGradient id={gradientId}>
          <stop offset="0%" stopColor="#475569" stopOpacity="0" />
          <stop offset="5%" stopColor="#475569" stopOpacity="0.2" />
          <stop offset="15%" stopColor="#475569" stopOpacity="0.5" />
          <stop offset="50%" stopColor="#475569" stopOpacity="0.7" />
          <stop offset="85%" stopColor="#475569" stopOpacity="0.5" />
          <stop offset="95%" stopColor="#475569" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#475569" stopOpacity="0" />
        </linearGradient>
      </defs>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: 1,
          stroke: `url(#${gradientId})`,
        }} 
      />
    </>
  );
};