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
  
  // Drag states
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoverTimeout, setHoverTimeout] = useState(null);

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
        cards: [initialCard],
        isNested: false
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
        cards: [],
        isNested: false
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

  // Card drag handlers
  const handleCardDragStart = (e, card, columnId) => {
    setDraggedCard({ card, columnId });
    e.dataTransfer.effectAllowed = 'move';
    e.target.style.opacity = '0.5';
  };

  const handleCardDragEnd = (e) => {
    e.target.style.opacity = '';
    setDraggedCard(null);
    setHoveredCard(null);
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
  };

  const handleCardDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleCardDrop = (e, targetColumnId, targetIndex = null) => {
    e.preventDefault();
    
    if (!draggedCard) return;
    
    const { card, columnId: sourceColumnId } = draggedCard;
    
    // Remove card from source column
    const newColumns = columns.map(col => {
      if (col.id === sourceColumnId) {
        return { ...col, cards: col.cards.filter(c => c.id !== card.id) };
      }
      return col;
    });
    
    // Add card to target column
    setColumns(newColumns.map(col => {
      if (col.id === targetColumnId) {
        const newCards = [...col.cards];
        if (targetIndex !== null) {
          newCards.splice(targetIndex, 0, card);
        } else {
          newCards.push(card);
        }
        return { ...col, cards: newCards };
      }
      return col;
    }));
    
    setDraggedCard(null);
  };

  // Handle card hover for merging
  const handleCardDragEnter = (e, card) => {
    if (!draggedCard || draggedCard.card.id === card.id) return;
    
    setHoveredCard(card);
    
    // Clear existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
    }
    
    // Set new timeout for merge
    const timeout = setTimeout(() => {
      if (hoveredCard && draggedCard) {
        mergeCards(hoveredCard, draggedCard.card);
      }
    }, 1500);
    
    setHoverTimeout(timeout);
  };

  const handleCardDragLeave = (e) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setHoveredCard(null);
  };

  // Merge two cards into a nested column
  const mergeCards = (targetCard, draggedCardData) => {
    // Find the column containing the target card
    const columnIndex = columns.findIndex(col => 
      col.cards.some(c => c.id === targetCard.id)
    );
    
    if (columnIndex === -1) return;
    
    const column = columns[columnIndex];
    
    // Create a nested column
    const nestedColumn = {
      id: `nested-col-${Date.now()}`,
      title: 'Nested Group',
      cards: [targetCard, draggedCardData],
      isNested: true
    };
    
    // Replace the target card with the nested column
    const newColumns = [...columns];
    const cardIndex = column.cards.findIndex(c => c.id === targetCard.id);
    
    // Remove both cards from their original locations
    newColumns.forEach(col => {
      col.cards = col.cards.filter(c => 
        c.id !== targetCard.id && c.id !== draggedCardData.id
      );
    });
    
    // Insert nested column as a special card
    newColumns[columnIndex].cards.splice(cardIndex, 0, {
      id: nestedColumn.id,
      type: 'nested-column',
      nestedColumn: nestedColumn
    });
    
    setColumns(newColumns);
    setDraggedCard(null);
    setHoveredCard(null);
  };

  // Column drag handlers
  const handleColumnDragStart = (e, columnId) => {
    setDraggedColumn(columnId);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.style.opacity = '0.3';
  };

  const handleColumnDragEnd = (e) => {
    e.currentTarget.style.opacity = '';
    setDraggedColumn(null);
    setDragOverColumn(null);
  };

  const handleColumnDragOver = (e, columnId) => {
    e.preventDefault();
    if (draggedColumn && draggedColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleColumnDrop = (e, targetColumnId) => {
    e.preventDefault();
    
    if (!draggedColumn || draggedColumn === targetColumnId) return;
    
    const draggedIndex = columns.findIndex(c => c.id === draggedColumn);
    const targetIndex = columns.findIndex(c => c.id === targetColumnId);
    
    const newColumns = [...columns];
    const [removed] = newColumns.splice(draggedIndex, 1);
    newColumns.splice(targetIndex, 0, removed);
    
    setColumns(newColumns);
    setDraggedColumn(null);
    setDragOverColumn(null);
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
            onCardDragStart={handleCardDragStart}
            onCardDragEnd={handleCardDragEnd}
            onCardDragOver={handleCardDragOver}
            onCardDrop={handleCardDrop}
            onCardDragEnter={handleCardDragEnter}
            onCardDragLeave={handleCardDragLeave}
            onColumnDragStart={handleColumnDragStart}
            onColumnDragEnd={handleColumnDragEnd}
            onColumnDragOver={handleColumnDragOver}
            onColumnDrop={handleColumnDrop}
            dragOverColumn={dragOverColumn}
            hoveredCard={hoveredCard}
            isNested={column.isNested}
          />
        ))}
      </div>
    </div>
  );
}

// Column Component
function Column({ 
  column, 
  onAddCard, 
  onRemoveColumn, 
  onRemoveCard, 
  onDuplicateCard,
  onCardDragStart,
  onCardDragEnd,
  onCardDragOver,
  onCardDrop,
  onCardDragEnter,
  onCardDragLeave,
  onColumnDragStart,
  onColumnDragEnd,
  onColumnDragOver,
  onColumnDrop,
  dragOverColumn,
  hoveredCard,
  isNested
}) {
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [isDraggingColumn, setIsDraggingColumn] = useState(false);

  const iconTypes = ['pen', 'microphone', 'camera', 'comment', 'envelope', 'graduation-cap', 'address-book', 'users', 'project-diagram', 'robot', 'search'];
  const icons = ['fa-pen', 'fa-microphone', 'fa-camera', 'fa-comment', 'fa-envelope', 'fa-graduation-cap', 'fa-address-book', 'fa-users', 'fa-project-diagram', 'fa-robot', 'fa-search'];

  const columnClass = `qwanyx-column ${isNested ? 'nested-column' : ''} ${dragOverColumn === column.id ? 'drag-over' : ''}`;

  return (
    <div 
      className={columnClass}
      draggable={!isNested}
      onDragStart={(e) => {
        setIsDraggingColumn(true);
        onColumnDragStart(e, column.id);
      }}
      onDragEnd={(e) => {
        setIsDraggingColumn(false);
        onColumnDragEnd(e);
      }}
      onDragOver={(e) => onColumnDragOver(e, column.id)}
      onDrop={(e) => onColumnDrop(e, column.id)}
    >
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
      
      <div 
        className="column-content"
        onDragOver={onCardDragOver}
        onDrop={(e) => onCardDrop(e, column.id)}
      >
        {showIconGrid && (
          <IconGrid 
            iconTypes={iconTypes}
            icons={icons}
            onSelectIcon={(type, icon) => {
              onAddCard(type, icon);
              setShowIconGrid(false);
            }}
          />
        )}
        
        {column.cards.map((card, index) => (
          card.type === 'nested-column' ? (
            <Column
              key={card.id}
              column={card.nestedColumn}
              onAddCard={onAddCard}
              onRemoveColumn={() => onRemoveCard(card.id)}
              onRemoveCard={onRemoveCard}
              onDuplicateCard={onDuplicateCard}
              onCardDragStart={onCardDragStart}
              onCardDragEnd={onCardDragEnd}
              onCardDragOver={onCardDragOver}
              onCardDrop={onCardDrop}
              onCardDragEnter={onCardDragEnter}
              onCardDragLeave={onCardDragLeave}
              isNested={true}
            />
          ) : (
            <Card 
              key={card.id}
              card={card}
              columnId={column.id}
              index={index}
              onRemove={() => onRemoveCard(card.id)}
              onDuplicate={() => onDuplicateCard(card)}
              onDragStart={onCardDragStart}
              onDragEnd={onCardDragEnd}
              onDragEnter={onCardDragEnter}
              onDragLeave={onCardDragLeave}
              isHovered={hoveredCard?.id === card.id}
            />
          )
        ))}
      </div>
    </div>
  );
}

// Icon Grid Component
function IconGrid({ iconTypes, icons, onSelectIcon }) {
  const [draggedIcon, setDraggedIcon] = useState(null);

  const handleIconDragStart = (e, type, icon) => {
    setDraggedIcon({ type, icon });
    e.dataTransfer.effectAllowed = 'copy';
  };

  return (
    <div className="icon-grid-wrapper">
      <div className="icon-grid">
        {iconTypes.map((type, index) => (
          <button
            key={type}
            className="control-btn"
            draggable
            onDragStart={(e) => handleIconDragStart(e, type, icons[index])}
            onClick={() => onSelectIcon(type, icons[index])}
          >
            <i className={`fas ${icons[index]}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}

// Card Component
function Card({ 
  card, 
  columnId,
  index,
  onRemove, 
  onDuplicate,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragLeave,
  isHovered
}) {
  const editorRef = useRef(null);
  const [editor, setEditor] = useState(null);

  useEffect(() => {
    if (!editorRef.current) return;
    
    const newEditor = BlockNoteEditor.create({
      initialContent: card.content || undefined,
    });
    
    setEditor(newEditor);
  }, []);

  const cardClass = `card ${isHovered ? 'merge-target' : ''}`;

  return (
    <div 
      className={cardClass}
      draggable
      onDragStart={(e) => onDragStart(e, card, columnId)}
      onDragEnd={onDragEnd}
      onDragEnter={(e) => onDragEnter(e, card)}
      onDragLeave={onDragLeave}
    >
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