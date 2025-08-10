import React from 'react';

function CardFront({ card, onDuplicate, onToggleExpanded, onRemove, onFlip }) {
  return (
    <div className="card-content">
      <div className="card-header-content">
        <i 
          className={`fas ${card.icon} card-icon`}
          onClick={onDuplicate}
          style={{ cursor: 'pointer' }}
        ></i>
        <span className="card-text">{card.text}</span>
        <button 
          className="card-flip" 
          onClick={onFlip}
        >
          <i className="fas fa-sync-alt"></i>
        </button>
        {card.isStack ? (
          <button className="card-delete" onClick={onToggleExpanded}>
            <i className={`fas fa-caret-${card.isExpanded ? 'down' : 'right'}`}></i>
          </button>
        ) : (
          <button className="card-delete" onClick={onRemove}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>
      
      {/* Show brief preview if enabled */}
      {card.showBrief && card.content && (
        <div style={{ 
          padding: '8px', 
          fontSize: '11px', 
          color: 'rgba(255, 255, 255, 0.6)', 
          borderTop: '1px solid rgba(255, 255, 255, 0.1)' 
        }}>
          {card.content.substring(0, 100)}...
        </div>
      )}
    </div>
  );
}

export default CardFront;