import React from 'react';

function Drawer({ isOpen, onClose, workspacePath = [], onNavigate }) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 2998,
            transition: 'opacity 0.3s'
          }}
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-280px',
        width: '280px',
        height: '100%',
        background: 'rgba(30, 30, 40, 0.98)',
        backdropFilter: 'blur(10px)',
        zIndex: 2999,
        transition: 'left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ 
            color: 'white', 
            margin: 0,
            fontSize: '18px',
            fontWeight: 'normal'
          }}>
            Navigation
          </h3>
        </div>
        
        {/* Workspace Path / Breadcrumb */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div style={{ 
            fontSize: '12px', 
            color: 'rgba(255, 255, 255, 0.5)',
            marginBottom: '10px'
          }}>
            Current Path
          </div>
          
          {workspacePath.length === 0 ? (
            <div style={{ color: 'white', fontSize: '14px' }}>
              <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
              QWANYX
            </div>
          ) : (
            <div>
              <button
                onClick={() => onNavigate(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'rgba(255, 255, 255, 0.7)',
                  cursor: 'pointer',
                  padding: '5px 0',
                  fontSize: '14px',
                  display: 'block',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                QWANYX
              </button>
              {workspacePath.map((workspace, index) => (
                <button
                  key={index}
                  onClick={() => onNavigate(workspace)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: index === workspacePath.length - 1 ? 'white' : 'rgba(255, 255, 255, 0.7)',
                    cursor: 'pointer',
                    padding: '5px 0 5px 20px',
                    fontSize: '14px',
                    display: 'block',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <i className={`fas ${workspace.icon}`} style={{ marginRight: '8px' }}></i>
                  {workspace.text}
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Menu Items */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <i className="fas fa-plus" style={{ marginRight: '12px', width: '20px' }}></i>
            Add Column
          </button>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <i className="fas fa-download" style={{ marginRight: '12px', width: '20px' }}></i>
            Export Workspace
          </button>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <i className="fas fa-cog" style={{ marginRight: '12px', width: '20px' }}></i>
            Settings
          </button>
          
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              padding: '12px 0',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              textAlign: 'left',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <i className="fas fa-trash" style={{ marginRight: '12px', width: '20px' }}></i>
            Clear Workspace
          </button>
        </div>
        
        {/* Footer */}
        <div style={{
          padding: '20px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '12px',
          color: 'rgba(255, 255, 255, 0.4)'
        }}>
          QWANYX v1.0
        </div>
      </div>
    </>
  );
}

export default Drawer;