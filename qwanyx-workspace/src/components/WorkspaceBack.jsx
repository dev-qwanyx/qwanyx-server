import React from 'react';

function WorkspaceBack({ columns, cards, onFlip }) {
  // Calculate some workspace statistics
  const totalCards = Object.values(cards).reduce((sum, columnCards) => sum + columnCards.length, 0);
  const totalColumns = columns.length;
  
  const cardsByType = Object.values(cards).flat().reduce((acc, card) => {
    acc[card.type] = (acc[card.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="workspace-back-content">
      <div className="workspace-back-header">
        <h2 style={{ color: 'white', margin: 0 }}>Workspace Overview</h2>
        <button 
          className="workspace-flip-btn"
          onClick={onFlip}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: '20px',
            cursor: 'pointer',
            padding: '10px',
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      
      <div className="workspace-stats" style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        padding: '30px',
        color: 'white'
      }}>
        <div className="stat-card" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Total Columns</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{totalColumns}</p>
        </div>
        
        <div className="stat-card" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          backdropFilter: 'blur(10px)'
        }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Total Cards</h3>
          <p style={{ margin: 0, fontSize: '32px', fontWeight: 'bold' }}>{totalCards}</p>
        </div>
        
        <div className="stat-card" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          padding: '20px',
          backdropFilter: 'blur(10px)',
          gridColumn: 'span 2'
        }}>
          <h3 style={{ margin: '0 0 15px 0', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Cards by Type</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {Object.entries(cardsByType).map(([type, count]) => (
              <div key={type} style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '5px 10px',
                borderRadius: '5px',
                fontSize: '12px'
              }}>
                <i className={`fas fa-${type}`} style={{ marginRight: '5px' }}></i>
                {type}: {count}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="workspace-settings" style={{
        padding: '30px',
        color: 'white'
      }}>
        <h3 style={{ marginBottom: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>Workspace Settings</h3>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Workspace Name
          </label>
          <input 
            type="text" 
            placeholder="My Workspace"
            style={{
              width: '300px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '14px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Background Color
          </label>
          <input 
            type="color" 
            defaultValue="#1a1a2e"
            style={{
              width: '100px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'inline', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '10px' }}
            />
            Enable auto-save
          </label>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'inline', fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            <input 
              type="checkbox" 
              style={{ marginRight: '10px' }}
            />
            Show grid
          </label>
        </div>
        
        <button style={{
          background: 'rgba(74, 158, 255, 0.2)',
          border: '1px solid rgba(74, 158, 255, 0.5)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}>
          Export Workspace
        </button>
      </div>
    </div>
  );
}

export default WorkspaceBack;