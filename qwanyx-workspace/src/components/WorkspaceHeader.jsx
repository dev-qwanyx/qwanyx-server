import React from 'react';

function WorkspaceHeader({ title = 'Workspace', icon = 'fa-th', onMenuClick, isNested = false, onBack }) {
  return (
    <div style={{
      position: 'sticky',
      top: 0,
      left: 0,
      right: 0,
      height: '48px',
      background: 'rgba(30, 30, 40, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
      display: 'flex',
      alignItems: 'center',
      padding: '0 12px',
      zIndex: 100,
      gap: '12px'
    }}>
      {/* Burger Menu or Back Button */}
      {isNested ? (
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
      ) : (
        <button
          onClick={onMenuClick}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
      )}
      
      {/* Icon and Title */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flex: 1,
        minWidth: 0
      }}>
        <i className={`fas ${icon}`} style={{ 
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '16px'
        }}></i>
        <h1 style={{ 
          color: 'white', 
          margin: 0,
          fontSize: '16px',
          fontWeight: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {title}
        </h1>
      </div>
      
      {/* Quick Actions */}
      <div style={{
        display: 'flex',
        gap: '4px'
      }}>
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          <i className="fas fa-search"></i>
        </button>
        
        <button
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            fontSize: '14px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'none';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
          }}
        >
          <i className="fas fa-ellipsis-v"></i>
        </button>
      </div>
    </div>
  );
}

export default WorkspaceHeader;