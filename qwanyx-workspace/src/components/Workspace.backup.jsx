import React, { useState, useEffect, useRef } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import './Workspace.css';

function Workspace() {
  const [columns, setColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(0);
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Add initial column on mount
  useEffect(() => {
    // Only add if no columns exist
    if (columns.length === 0) {
      const initialCard = {
        id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'pen',
        icon: 'fa-pen',
        text: `New note - ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
        content: ''
      };
      
      const initialColumn = {
        id: `col-${Date.now()}`,
        title: `Column 1`,
        cards: [initialCard]
      };
      
      setColumns([initialColumn]);
      setColumnCount(1);
    }
  }, []);

  // Add a new column
  const addColumn = () => {
    setColumnCount(prev => {
      const newCount = prev + 1;
      
      const newColumn = {
        id: `col-${Date.now()}`,
        title: `Column ${newCount}`,
        cards: []
      };
      
      setColumns(prevColumns => [...prevColumns, newColumn]);
      
      // Add initial card to new column
      setTimeout(() => {
        const newCard = {
          id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: 'pen',
          icon: 'fa-pen',
          text: `New note - ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`,
          content: ''
        };
        
        setColumns(prevColumns => 
          prevColumns.map(col => 
            col.id === newColumn.id 
              ? { ...col, cards: [...col.cards, newCard] }
              : col
          )
        );
      }, 100);
      
      return newCount;
    });
  };

  // Add a card to a column
  const addCard = (columnId, type = 'pen', icon = 'fa-pen') => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const cardText = {
      'pen': 'Text note',
      'microphone': 'Voice note',
      'camera': 'Photo',
      'comment': 'Comment',
      'envelope': 'Email',
      'graduation-cap': 'Learning',
      'address-book': 'Contact',
      'users': 'Group',
      'project-diagram': 'Project',
      'robot': 'DH',
      'search': 'Search'
    };
    
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      icon: icon,
      text: `${cardText[type] || 'Note'} - ${timeString}`,
      content: ''
    };
    
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, cards: [...col.cards, newCard] }
        : col
    ));
  };

  // Remove a column
  const removeColumn = (columnId) => {
    if (columns.length > 1) {
      setColumns(columns.filter(c => c.id !== columnId));
    }
  };

  // Remove a card
  const removeCard = (columnId, cardId) => {
    setColumns(columns.map(col => 
      col.id === columnId 
        ? { ...col, cards: col.cards.filter(card => card.id !== cardId) }
        : col
    ));
  };

  // Duplicate a card
  const duplicateCard = (columnId, card) => {
    addCard(columnId, card.type, card.icon);
  };

  // Horizontal scroll with drag
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.card')) return;
    
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="workspace-body">
      <div 
        className={`columns-container ${isDown ? 'dragging' : ''}`}
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {columns.map((column) => (
          <Column 
            key={column.id}
            column={column}
            onAddCard={(type, icon) => addCard(column.id, type, icon)}
            onRemoveColumn={() => removeColumn(column.id)}
            onRemoveCard={(cardId) => removeCard(column.id, cardId)}
            onDuplicateCard={(card) => duplicateCard(column.id, card)}
          />
        ))}
      </div>
    </div>
  );
}

// Column Component
function Column({ column, onAddCard, onRemoveColumn, onRemoveCard, onDuplicateCard }) {
  const [showIconGrid, setShowIconGrid] = useState(false);

  const iconTypes = ['pen', 'microphone', 'camera', 'comment', 'envelope', 'graduation-cap', 'address-book', 'users', 'project-diagram', 'robot', 'search'];
  const icons = ['fa-pen', 'fa-microphone', 'fa-camera', 'fa-comment', 'fa-envelope', 'fa-graduation-cap', 'fa-address-book', 'fa-users', 'fa-project-diagram', 'fa-robot', 'fa-search'];

  return (
    <div className="qwanyx-column">
      <div className="drop-zone left"></div>
      <div className="drop-zone right"></div>
      
      <div className="column-header">
        <button 
          className="header-burger" 
          onClick={() => setShowIconGrid(!showIconGrid)}
        >
          <i className="fas fa-bars"></i>
        </button>
        <span className="header-title">{column.title}</span>
        <button className="header-close" onClick={onRemoveColumn}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="column-content">
        {showIconGrid && (
          <div className="icon-grid-wrapper">
            <div className="icon-grid">
              {iconTypes.map((type, index) => (
                <button
                  key={type}
                  className="control-btn"
                  onClick={() => {
                    onAddCard(type, icons[index]);
                    setShowIconGrid(false);
                  }}
                >
                  <i className={`fas ${icons[index]}`}></i>
                </button>
              ))}
            </div>
          </div>
        )}
        
        {column.cards.map((card) => (
          <Card 
            key={card.id}
            card={card}
            onRemove={() => onRemoveCard(card.id)}
            onDuplicate={() => onDuplicateCard(card)}
          />
        ))}
      </div>
    </div>
  );
}

// Card Component
function Card({ card, onRemove, onDuplicate }) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const newEditor = BlockNoteEditor.create({
      initialContent: card.content || undefined,
    });
    
    setEditor(newEditor);
  }, []);

  return (
    <div className="card">
      <div className="card-content">
        <div className="card-header-content">
          <i 
            className={`fas ${card.icon} card-icon`}
            onClick={onDuplicate}
            style={{ cursor: 'pointer' }}
          ></i>
          <span className="card-text">{card.text}</span>
          <button className="card-delete" onClick={onRemove}>
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div ref={editorRef} className="card-brief-editor">
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
}

export default Workspace;