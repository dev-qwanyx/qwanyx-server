import React, { useState } from 'react';

const CARD_TYPES = [
  { type: 'pen', icon: 'fa-pen', label: 'Text note' },
  { type: 'microphone', icon: 'fa-microphone', label: 'Voice note' },
  { type: 'camera', icon: 'fa-camera', label: 'Photo' },
  { type: 'comment', icon: 'fa-comment', label: 'Comment' },
  { type: 'envelope', icon: 'fa-envelope', label: 'Email' },
  { type: 'graduation-cap', icon: 'fa-graduation-cap', label: 'Learning' },
  { type: 'address-book', icon: 'fa-address-book', label: 'Contact' },
  { type: 'users', icon: 'fa-users', label: 'Group' },
  { type: 'project-diagram', icon: 'fa-project-diagram', label: 'Project' },
  { type: 'robot', icon: 'fa-robot', label: 'DH' },
  { type: 'search', icon: 'fa-search', label: 'Search' }
];

function TypeDropdown({ value, icon, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item) => {
    onChange(item.type, item.icon);
    setIsOpen(false);
  };

  const formatLabel = (type) => {
    if (!type) return 'Select type';
    return type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ');
  };

  return (
    <div style={{ position: 'relative' }}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', 
          background: 'rgba(255, 255, 255, 0.1)', 
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          color: 'white', 
          padding: '5px 5px 5px 35px', 
          borderRadius: '4px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <i className={`fas ${icon}`} style={{ position: 'absolute', left: '10px', color: 'rgba(255, 255, 255, 0.6)' }}></i>
          <span>{formatLabel(value)}</span>
        </div>
        <i className={`fas fa-caret-${isOpen ? 'up' : 'down'}`} style={{ color: 'rgba(255, 255, 255, 0.6)' }}></i>
      </div>
      
      {isOpen && (
        <div className="custom-dropdown" style={{ 
          position: 'absolute', 
          top: '100%', 
          left: 0, 
          right: 0, 
          background: 'rgb(89, 87, 96)',
          border: '1px solid rgba(255, 255, 255, 0.2)', 
          borderRadius: '4px',
          marginTop: '2px',
          zIndex: 1000,
          maxHeight: '200px',
          overflowY: 'auto',
          overflowX: 'hidden'
        }}>
          {CARD_TYPES.map(item => (
            <div 
              key={item.type}
              onClick={() => handleSelect(item)}
              style={{ 
                padding: '8px 10px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'white',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <i className={`fas ${item.icon}`} style={{ width: '20px', marginRight: '10px', opacity: 0.8 }}></i>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TypeDropdown;