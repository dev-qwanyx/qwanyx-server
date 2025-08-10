import React from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';

function CardEditor({ card, editor, onClose }) {
  const renderEditor = () => {
    switch(card.type) {
      case 'address-book':
        return (
          <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Avatar</label>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: 'rgba(255, 255, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginBottom: '15px'
              }}>
                <i className="fas fa-user" style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.3)' }}></i>
              </div>
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>First Name</label>
              <input 
                type="text" 
                placeholder="John" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Last Name</label>
              <input 
                type="text" 
                placeholder="Doe" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Phone</label>
              <input 
                type="tel" 
                placeholder="+1 234 567 8900" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Email</label>
              <input 
                type="email" 
                placeholder="john.doe@example.com" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Company</label>
              <input 
                type="text" 
                placeholder="Acme Corp" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Notes</label>
              <textarea 
                placeholder="Additional notes..." 
                rows="3"
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px',
                  resize: 'vertical'
                }} 
              />
            </div>
          </div>
        );
        
      case 'pen':
      case 'comment':
        return (
          <div style={{ padding: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Content</label>
            <div className="card-brief-editor">
              {editor && (
                <BlockNoteView 
                  editor={editor}
                  theme="dark"
                />
              )}
            </div>
          </div>
        );
        
      case 'microphone':
        return (
          <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Voice Recording</label>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.1)', 
                border: '1px solid rgba(255, 255, 255, 0.2)', 
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center'
              }}>
                <i className="fas fa-microphone" style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '10px' }}></i>
                <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>Voice recording feature coming soon</p>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Transcript</label>
              <textarea 
                placeholder="Voice transcript will appear here..." 
                rows="5"
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px',
                  resize: 'vertical'
                }} 
              />
            </div>
          </div>
        );
        
      case 'camera':
        return (
          <div style={{ padding: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Image</label>
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              border: '1px solid rgba(255, 255, 255, 0.2)', 
              borderRadius: '4px',
              padding: '40px',
              textAlign: 'center',
              marginBottom: '15px'
            }}>
              <i className="fas fa-camera" style={{ fontSize: '32px', color: 'rgba(255, 255, 255, 0.3)', marginBottom: '10px' }}></i>
              <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '12px' }}>Click to upload image</p>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Caption</label>
              <input 
                type="text" 
                placeholder="Image caption..." 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
          </div>
        );
        
      case 'envelope':
        return (
          <div style={{ padding: '10px' }}>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>To</label>
              <input 
                type="email" 
                placeholder="recipient@example.com" 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Subject</label>
              <input 
                type="text" 
                placeholder="Email subject..." 
                style={{ 
                  width: '100%', 
                  background: 'rgba(255, 255, 255, 0.1)', 
                  border: '1px solid rgba(255, 255, 255, 0.2)', 
                  color: 'white', 
                  padding: '8px', 
                  borderRadius: '4px' 
                }} 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Message</label>
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
        );
        
      default:
        return (
          <div style={{ padding: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: 'rgba(255, 255, 255, 0.6)' }}>Content</label>
            <div className="card-brief-editor">
              {editor && (
                <BlockNoteView 
                  editor={editor}
                  theme="dark"
                />
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="card-content">
      <div className="card-header-content">
        <i className={`fas ${card.icon} card-icon`} style={{ marginRight: '10px', opacity: 0.8 }}></i>
        <span className="card-text">Edit: {card.text}</span>
        <button 
          className="card-close" 
          onClick={onClose}
          style={{ 
            background: 'none', 
            border: 'none', 
            color: 'rgba(255, 255, 255, 0.3)', 
            cursor: 'pointer', 
            fontSize: '12px', 
            padding: '5px' 
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="card-editor-content">
        {renderEditor()}
      </div>
    </div>
  );
}

export default CardEditor;