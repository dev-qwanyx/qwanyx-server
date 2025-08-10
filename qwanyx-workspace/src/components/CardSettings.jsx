import React from 'react';
import TypeDropdown from './TypeDropdown';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

function CardSettings({ card, editor, onToggleShowBrief, onUpdateCardType, onFlip }) {
  return (
    <div className="card-content">
      <div className="card-header-content">
        <i className={`fas ${card.icon} card-icon`} style={{ marginRight: '10px', opacity: 0.8 }}></i>
        <span className="card-text">Settings: {card.text}</span>
        <button 
          className="card-flip" 
          onClick={onFlip}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
      </div>
      
      <div className="card-metadata" style={{ padding: '10px', color: 'rgba(255, 255, 255, 0.8)' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Type:</label>
          <TypeDropdown 
            value={card.type} 
            icon={card.icon} 
            onChange={onUpdateCardType}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Tags:</label>
          <input 
            type="text" 
            placeholder="Add tags..." 
            style={{ 
              width: '100%', 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              color: 'white', 
              padding: '5px', 
              borderRadius: '4px' 
            }} 
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Created:</label>
          <span style={{ fontSize: '12px' }}>{new Date().toLocaleDateString()}</span>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'inline', marginRight: '10px', fontSize: '12px' }}>
            <input 
              type="checkbox" 
              checked={card.isStack || false} 
              style={{ marginRight: '5px' }} 
              readOnly
            />
            Is Stack
          </label>
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'inline', marginRight: '10px', fontSize: '12px' }}>
            <input 
              type="checkbox" 
              checked={card.showBrief || false} 
              onChange={onToggleShowBrief} 
              style={{ marginRight: '5px' }} 
            />
            Show brief in card view
          </label>
        </div>
        
        <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px' }}>Content:</label>
          <div className="card-brief-editor">
            {editor && (
              <BlockNoteView 
                editor={editor}
                theme="dark"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardSettings;