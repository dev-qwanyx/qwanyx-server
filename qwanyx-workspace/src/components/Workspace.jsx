import React, { useState, useEffect, useRef } from 'react';
import { BlockNoteView } from '@blocknote/mantine';
import { BlockNoteEditor } from '@blocknote/core';
import '@blocknote/mantine/style.css';
import './Workspace.css';
import IconGrid from './IconGrid';
import CardFront from './CardFront';
import CardSettings from './CardSettings';
import CardEditor from './CardEditor';
import WorkspaceHeader from './WorkspaceHeader';
import Drawer from './Drawer';

function Workspace({ isNested = false, parentWorkspace = null, onBack = null }) {
  const [columns, setColumns] = useState([]);
  const [columnCount, setColumnCount] = useState(0);
  const [cards, setCards] = useState({}); // Cards organized by column ID
  const [activeWorkspace, setActiveWorkspace] = useState(null); // Track which workspace card is active
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [workspacePath, setWorkspacePath] = useState([]);
  const containerRef = useRef(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const animationFrameRef = useRef(null);
  const initializedRef = useRef(false);
  const addColumnTimeoutRef = useRef(null);

  // Add initial column on mount
  useEffect(() => {
    // Use a ref to ensure initialization only happens once
    if (!initializedRef.current && columns.length === 0) {
      initializedRef.current = true;
      addColumn(); // Just one empty column
    }
  }, []); // Empty dependency array ensures this runs only once per mount

  // Listen for workspace open events
  useEffect(() => {
    const handleOpenWorkspace = (e) => {
      setActiveWorkspace(e.detail);
    };

    const workspaceEl = document.querySelector('.workspace-body');
    if (workspaceEl) {
      workspaceEl.addEventListener('openWorkspace', handleOpenWorkspace);
    }

    return () => {
      if (workspaceEl) {
        workspaceEl.removeEventListener('openWorkspace', handleOpenWorkspace);
      }
    };
  }, []);

  // Add a new column with debouncing
  const addColumn = (titleOrType = null) => {
    // Clear any pending column additions
    if (addColumnTimeoutRef.current) {
      clearTimeout(addColumnTimeoutRef.current);
    }
    
    // Debounce column creation to prevent duplicates
    addColumnTimeoutRef.current = setTimeout(() => {
      const newCount = columnCount + 1;
      setColumnCount(newCount);
      
      // If titleOrType looks like a card text (contains time), use it directly
      // Otherwise treat it as a type
      const isCardTitle = titleOrType && (titleOrType.includes(':') || titleOrType.includes(' - '));
      
      const newColumn = {
        id: `col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: isCardTitle ? titleOrType : (titleOrType ? `${titleOrType.charAt(0).toUpperCase() + titleOrType.slice(1)} Column` : `Column ${newCount}`),
        cardData: null // Will store the card data when a card becomes a column
      };
      
      setColumns(prevColumns => [...prevColumns, newColumn]);
      setCards(prevCards => ({
        ...prevCards,
        [newColumn.id]: [] // Initialize empty cards array for new column
      }));
      addColumnTimeoutRef.current = null;
    }, 50); // Small delay to prevent duplicate calls
  };

  // Remove a column
  const removeColumn = (columnId) => {
    if (columns.length > 1) {
      setColumns(columns.filter(c => c.id !== columnId));
      setCards(prevCards => {
        const newCards = { ...prevCards };
        delete newCards[columnId];
        return newCards;
      });
    }
  };

  // Add a card to a specific column
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
      content: '',
      isStack: false,
      isExpanded: false,
      showBrief: false,
      children: []
    };
    
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: [...(prevCards[columnId] || []), newCard]
    }));
  };

  // Remove a card from a column
  const removeCard = (columnId, cardId) => {
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: prevCards[columnId].filter(card => card.id !== cardId)
    }));
  };

  // Duplicate a card in its current column
  const duplicateCard = (columnId, card) => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    const newCard = {
      id: `card-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: card.type,
      icon: card.icon,
      text: card.text.replace(/ - \d{2}:\d{2}/, '') + ` - ${timeString} (copy)`,
      content: card.content || '',
      isStack: false,
      isExpanded: false,
      showBrief: false,
      children: []
    };
    
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: [...(prevCards[columnId] || []), newCard]
    }));
  };

  // Move a card from one column to another
  const moveCard = (fromColumnId, toColumnId, card, position = null) => {
    setCards(prevCards => {
      const newCards = { ...prevCards };
      
      // Remove from source column
      newCards[fromColumnId] = newCards[fromColumnId].filter(c => c.id !== card.id);
      
      // Add to target column
      if (!newCards[toColumnId]) {
        newCards[toColumnId] = [];
      }
      
      if (position !== null && position >= 0) {
        newCards[toColumnId].splice(position, 0, card);
      } else {
        newCards[toColumnId].push(card);
      }
      
      return newCards;
    });
  };

  // Toggle expand/collapse for stack cards
  const toggleCardExpanded = (columnId, cardId) => {
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: prevCards[columnId].map(card => 
        card.id === cardId ? { ...card, isExpanded: !card.isExpanded } : card
      )
    }));
  };

  // Toggle show brief in card view
  const toggleShowBrief = (columnId, cardId) => {
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: prevCards[columnId].map(card => 
        card.id === cardId ? { ...card, showBrief: !card.showBrief } : card
      )
    }));
  };

  // Update card type and icon
  const updateCardType = (columnId, cardId, newType, newIcon) => {
    setCards(prevCards => ({
      ...prevCards,
      [columnId]: prevCards[columnId].map(card => 
        card.id === cardId ? { ...card, type: newType, icon: newIcon } : card
      )
    }));
  };

  // Horizontal scroll with drag and inertia
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('.card')) return;
    
    setIsDown(true);
    containerRef.current.classList.add('dragging');
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
    setVelocity(0);
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const handleMouseLeave = () => {
    if (isDown) {
      setIsDown(false);
      containerRef.current.classList.remove('dragging');
      applyInertia();
    }
  };

  const handleMouseUp = () => {
    if (isDown) {
      setIsDown(false);
      containerRef.current.classList.remove('dragging');
      applyInertia();
    }
  };

  const handleMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    const newScrollLeft = scrollLeft - walk;
    
    setVelocity(containerRef.current.scrollLeft - newScrollLeft);
    containerRef.current.scrollLeft = newScrollLeft;
  };

  const applyInertia = () => {
    if (Math.abs(velocity) > 0.5) {
      containerRef.current.scrollLeft -= velocity;
      setVelocity(v => v * 0.95);
      animationFrameRef.current = requestAnimationFrame(applyInertia);
    }
  };

  // If a workspace card is active, show it fullscreen
  if (activeWorkspace) {
    return (
      <div className="workspace-fullscreen" style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: '#1a1a2e',
        zIndex: 2000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Recursive Workspace - show a new workspace instance */}
        <Workspace 
          isNested={true}
          parentWorkspace={activeWorkspace}
          onBack={() => setActiveWorkspace(null)}
        />
      </div>
    );
  }

  return (
    <div className="workspace-body" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <WorkspaceHeader 
        title={parentWorkspace ? parentWorkspace.card.text : 'QWANYX'}
        icon={parentWorkspace ? parentWorkspace.card.icon : 'fa-home'}
        onMenuClick={() => setDrawerOpen(!drawerOpen)}
        isNested={isNested}
        onBack={onBack}
      />
      
      <Drawer 
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        workspacePath={workspacePath}
        onNavigate={(workspace) => {
          if (workspace) {
            setActiveWorkspace(workspace);
          } else {
            // Navigate to root
            if (onBack) onBack();
          }
          setDrawerOpen(false);
        }}
      />
      <div 
        className="columns-container"
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
            cards={cards[column.id] || []}
            onRemove={() => removeColumn(column.id)}
            onAddCard={(type, icon) => addCard(column.id, type, icon)}
            onRemoveCard={(cardId) => removeCard(column.id, cardId)}
            onDuplicateCard={(card, targetColumnId) => duplicateCard(targetColumnId || column.id, card)}
            onMoveCard={moveCard}
            onToggleExpanded={(cardId) => toggleCardExpanded(column.id, cardId)}
            onToggleShowBrief={(cardId) => toggleShowBrief(column.id, cardId)}
            onUpdateCardType={(cardId, type, icon) => updateCardType(column.id, cardId, type, icon)}
            containerRef={containerRef}
            onAddColumn={addColumn}
          />
        ))}
      </div>
    </div>
  );
}

// Column Component - handles its own drag logic
function Column({ column, cards, onRemove, onAddCard, onRemoveCard, onDuplicateCard, onMoveCard, onToggleExpanded, onToggleShowBrief, onUpdateCardType, containerRef, onAddColumn }) {
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [iconGridPosition, setIconGridPosition] = useState({ top: 0, left: 0 });
  const columnRef = useRef(null);
  const contentRef = useRef(null);
  const burgerRef = useRef(null);

  // Close icon grid when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      // Check if click is outside icon grid and not on the burger button
      if (showIconGrid && 
          !e.target.closest('.icon-grid-wrapper') && 
          !e.target.closest('.header-burger')) {
        setShowIconGrid(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIconGrid]);

  // Column drag logic for reordering
  useEffect(() => {
    if (!columnRef.current) return;
    
    let isDraggingColumn = false;
    let dragStartX = 0;
    let columnGhost = null;
    let dropIndicator = null;
    
    const handleColumnMouseDown = (e) => {
      // Only allow dragging from the column header, but not from buttons
      if (!e.target.closest('.column-header') || 
          e.target.closest('.header-close') || 
          e.target.closest('.header-burger')) {
        return;
      }
      
      dragStartX = e.clientX;
      const startY = e.clientY;
      
      let dragTimeout = setTimeout(() => {
        isDraggingColumn = true;
        window.columnDragging = true;
        columnRef.current.classList.add('dragging');
        
        // Create ghost column - just show a simple placeholder
        columnGhost = document.createElement('div');
        columnGhost.className = 'column-ghost';
        
        // Create a simplified ghost without icon grids
        const columnTitle = columnRef.current.querySelector('.header-title')?.textContent || 'Column';
        const cardCount = columnRef.current.querySelectorAll('.card').length;
        
        columnGhost.innerHTML = `
          <div style="padding: 20px; color: white;">
            <div style="font-size: 16px; margin-bottom: 10px;">${columnTitle}</div>
            <div style="font-size: 14px; opacity: 0.7;">${cardCount} card${cardCount !== 1 ? 's' : ''}</div>
          </div>
        `;
        
        columnGhost.style.cssText = `
          position: fixed;
          width: 300px;
          height: 100px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(74, 158, 255, 0.5);
          border-radius: 10px;
          z-index: 10000;
          pointer-events: none;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
        `;
        columnGhost.style.left = (e.clientX - 150) + 'px';
        columnGhost.style.top = (e.clientY - 50) + 'px';
        document.body.appendChild(columnGhost);
        
        document.body.style.userSelect = 'none';
      }, 400); // Longer delay for column drag
      
      const onMouseMove = (e) => {
        if (isDraggingColumn && columnGhost) {
          columnGhost.style.left = (e.clientX - 150) + 'px';
          columnGhost.style.top = (e.clientY - 50) + 'px';
          
          // Find the best drop position
          const allColumns = containerRef.current.querySelectorAll('.qwanyx-column:not(.dragging)');
          let dropTarget = null;
          let dropPosition = null;
          
          allColumns.forEach(col => {
            const rect = col.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            
            if (e.clientX >= rect.left - 100 && e.clientX <= rect.right + 100) {
              dropTarget = col;
              dropPosition = e.clientX < midpoint ? 'before' : 'after';
            }
          });
          
          // Remove existing drop indicator
          if (dropIndicator) {
            dropIndicator.remove();
            dropIndicator = null;
          }
          
          // Show drop indicator
          if (dropTarget) {
            dropIndicator = document.createElement('div');
            dropIndicator.className = 'column-drop-indicator';
            dropIndicator.style.cssText = `
              position: absolute;
              width: 4px;
              height: 100%;
              background: rgba(74, 158, 255, 0.8);
              z-index: 9999;
              pointer-events: none;
            `;
            
            const rect = dropTarget.getBoundingClientRect();
            const containerRect = containerRef.current.getBoundingClientRect();
            
            if (dropPosition === 'before') {
              dropIndicator.style.left = (rect.left - containerRect.left - 2) + 'px';
            } else {
              dropIndicator.style.left = (rect.right - containerRect.left - 2) + 'px';
            }
            
            containerRef.current.appendChild(dropIndicator);
          }
        } else if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - startY) > 5) {
          clearTimeout(dragTimeout);
        }
      };
      
      const onMouseUp = (e) => {
        clearTimeout(dragTimeout);
        
        if (isDraggingColumn && columnGhost) {
          // Find where to drop the column
          const allColumns = containerRef.current.querySelectorAll('.qwanyx-column:not(.dragging)');
          let dropTarget = null;
          let dropPosition = null;
          
          allColumns.forEach(col => {
            const rect = col.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            
            if (e.clientX >= rect.left - 100 && e.clientX <= rect.right + 100) {
              dropTarget = col;
              dropPosition = e.clientX < midpoint ? 'before' : 'after';
            }
          });
          
          // Reorder columns if we have a valid drop target
          if (dropTarget) {
            const draggedColumn = columnRef.current;
            const parent = draggedColumn.parentElement;
            
            if (dropPosition === 'before') {
              parent.insertBefore(draggedColumn, dropTarget);
            } else {
              parent.insertBefore(draggedColumn, dropTarget.nextSibling);
            }
          }
          
          // Clean up
          columnRef.current.classList.remove('dragging');
          document.body.style.userSelect = '';
          
          if (dropIndicator) {
            dropIndicator.remove();
            dropIndicator = null;
          }
          
          if (columnGhost) {
            columnGhost.remove();
            columnGhost = null;
          }
        }
        
        isDraggingColumn = false;
        window.columnDragging = false;
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    
    const header = columnRef.current?.querySelector('.column-header');
    if (header) {
      header.addEventListener('mousedown', handleColumnMouseDown);
    }
    
    return () => {
      const header = columnRef.current?.querySelector('.column-header');
      if (header) {
        header.removeEventListener('mousedown', handleColumnMouseDown);
      }
    };
  }, []);

  return (
    <div className="qwanyx-column" ref={columnRef} data-column-id={column.id}>
      <div className="drop-zone left"></div>
      <div className="drop-zone right"></div>
      
      <div className="column-header">
        <button 
          ref={burgerRef}
          className="header-burger" 
          onClick={(e) => {
            if (!showIconGrid) {
              const rect = e.currentTarget.getBoundingClientRect();
              setIconGridPosition({
                top: rect.bottom + 5,
                left: rect.left
              });
            }
            setShowIconGrid(!showIconGrid);
          }}
        >
          <i className="fas fa-bars"></i>
        </button>
        <span className="header-title">{column.title}</span>
        <button className="header-close" onClick={onRemove}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="column-content" ref={contentRef}>
        {showIconGrid && (
          <div style={{
            position: 'fixed',
            top: `${iconGridPosition.top}px`,
            left: `${iconGridPosition.left}px`,
            zIndex: 1000
          }}>
            <IconGrid 
              onSelectIcon={(type, icon) => {
                onAddCard(type, icon);
                setShowIconGrid(false);
              }}
              containerRef={containerRef}
              onAddColumn={onAddColumn}
            />
          </div>
        )}
        
        {cards.map((card) => (
          <Card 
            key={card.id}
            card={card}
            columnId={column.id}
            onRemove={() => onRemoveCard(card.id)}
            onDuplicate={(currentColId) => {
              // Duplicate in the specified column
              onDuplicateCard(card, currentColId);
            }}
            onMoveCard={onMoveCard}
            onToggleExpanded={() => onToggleExpanded(card.id)}
            onToggleShowBrief={() => onToggleShowBrief(card.id)}
            onUpdateCardType={(type, icon) => onUpdateCardType(card.id, type, icon)}
            contentRef={contentRef}
            containerRef={containerRef}
            onAddColumn={onAddColumn}
          />
        ))}
      </div>
    </div>
  );
}


// Helper function to make a column draggable
function makeColumnDraggable(columnElement) {
  let isDraggingColumn = false;
  let dragStartX = 0;
  let columnGhost = null;
  let dropIndicator = null;
  
  const handleColumnMouseDown = (e) => {
    // Only allow dragging from the column header, but not from buttons
    if (!e.target.closest('.column-header') || 
        e.target.closest('.header-close') || 
        e.target.closest('.header-burger')) {
      return;
    }
    
    dragStartX = e.clientX;
    const startY = e.clientY;
    
    let dragTimeout = setTimeout(() => {
      isDraggingColumn = true;
      window.columnDragging = true;
      columnElement.classList.add('dragging');
      
      // Create ghost column
      columnGhost = document.createElement('div');
      columnGhost.className = 'column-ghost';
      
      const columnTitle = columnElement.querySelector('.header-title')?.textContent || 'Column';
      const cardCount = columnElement.querySelectorAll('.card').length;
      
      columnGhost.innerHTML = `
        <div style="padding: 20px; color: white;">
          <div style="font-size: 16px; margin-bottom: 10px;">${columnTitle}</div>
          <div style="font-size: 14px; opacity: 0.7;">${cardCount} card${cardCount !== 1 ? 's' : ''}</div>
        </div>
      `;
      
      columnGhost.style.cssText = `
        position: fixed;
        width: 300px;
        height: 100px;
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(74, 158, 255, 0.5);
        border-radius: 10px;
        z-index: 10000;
        pointer-events: none;
        opacity: 0.8;
        display: flex;
        align-items: center;
        justify-content: center;
        backdrop-filter: blur(10px);
      `;
      columnGhost.style.left = (e.clientX - 150) + 'px';
      columnGhost.style.top = (e.clientY - 50) + 'px';
      document.body.appendChild(columnGhost);
      
      document.body.style.userSelect = 'none';
    }, 400);
    
    const onMouseMove = (e) => {
      if (isDraggingColumn && columnGhost) {
        columnGhost.style.left = (e.clientX - 150) + 'px';
        columnGhost.style.top = (e.clientY - 50) + 'px';
      } else if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - startY) > 5) {
        clearTimeout(dragTimeout);
      }
    };
    
    const onMouseUp = (e) => {
      clearTimeout(dragTimeout);
      
      if (isDraggingColumn && columnGhost) {
        // Check if dropped on a card (to nest inside its parent column)
        const hoveredCard = document.elementFromPoint(e.clientX, e.clientY)?.closest('.card');
        
        if (hoveredCard && !columnElement.contains(hoveredCard)) {
          // Drop the column after the hovered card in its parent column
          const parentColumn = hoveredCard.closest('.column-content');
          if (parentColumn) {
            // Insert the nested column after the card
            parentColumn.insertBefore(columnElement, hoveredCard.nextSibling);
            
            // Ensure nested styling if not already nested
            if (!columnElement.classList.contains('nested-column')) {
              columnElement.classList.add('nested-column');
              columnElement.style.width = '100%';
              columnElement.style.minWidth = 'unset';
              columnElement.style.margin = '10px 0';
            }
          }
        } else {
          // Check if dropped inside a column content area
          const targetColumnContent = document.elementFromPoint(e.clientX, e.clientY)?.closest('.column-content');
          
          if (targetColumnContent && !columnElement.contains(targetColumnContent)) {
            // Drop inside the column as a nested column
            targetColumnContent.appendChild(columnElement);
            
            // Apply nested styling
            if (!columnElement.classList.contains('nested-column')) {
              columnElement.classList.add('nested-column');
              columnElement.style.width = '100%';
              columnElement.style.minWidth = 'unset';
              columnElement.style.margin = '10px 0';
            }
          } else {
            // Check if dropped in the columns container area (to become top-level)
            const columnsContainer = document.querySelector('.columns-container');
            const containerRect = columnsContainer.getBoundingClientRect();
            
            // Check if mouse is within the columns container area
            const isInColumnsArea = e.clientX >= containerRect.left && 
                                   e.clientX <= containerRect.right && 
                                   e.clientY >= containerRect.top && 
                                   e.clientY <= containerRect.bottom;
            
            if (isInColumnsArea) {
              // Find the best position among top-level columns
              const allTopLevelColumns = columnsContainer.querySelectorAll(':scope > .qwanyx-column');
              let dropTarget = null;
              let dropPosition = null;
              
              allTopLevelColumns.forEach(col => {
                if (col === columnElement) return;
                
                const rect = col.getBoundingClientRect();
                const midpoint = rect.left + rect.width / 2;
                
                if (e.clientX >= rect.left - 100 && e.clientX <= rect.right + 100) {
                  dropTarget = col;
                  dropPosition = e.clientX < midpoint ? 'before' : 'after';
                }
              });
              
              // Remove from current parent if nested
              if (columnElement.parentElement.classList.contains('column-content')) {
                // Remove nested styling when becoming top-level
                columnElement.classList.remove('nested-column');
                columnElement.style.width = '520px';
                columnElement.style.minWidth = '520px';
                columnElement.style.maxWidth = '520px';
                columnElement.style.margin = '';
                columnElement.style.background = 'rgba(255, 255, 255, 0.25)';
                columnElement.style.height = '100%';
                columnElement.style.padding = '15px';
              }
              
              if (dropTarget) {
                // Insert at specific position between columns
                if (dropPosition === 'before') {
                  columnsContainer.insertBefore(columnElement, dropTarget);
                } else {
                  columnsContainer.insertBefore(columnElement, dropTarget.nextSibling);
                }
              } else {
                // Add to end of columns
                columnsContainer.appendChild(columnElement);
              }
            }
          }
        }
        
        // Clean up
        columnElement.classList.remove('dragging');
        document.body.style.userSelect = '';
        
        if (columnGhost) {
          columnGhost.remove();
          columnGhost = null;
        }
      }
      
      isDraggingColumn = false;
      window.columnDragging = false;
      
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };
  
  const header = columnElement.querySelector('.column-header');
  if (header) {
    header.addEventListener('mousedown', handleColumnMouseDown);
  }
}

// Card Component - handles its own drag logic
function Card({ card, columnId, onRemove, onDuplicate, onMoveCard, onToggleExpanded, onToggleShowBrief, onUpdateCardType, contentRef, containerRef, onAddColumn }) {
  const cardRef = useRef(null);
  const [editor, setEditor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewState, setViewState] = useState('front'); // 'front', 'settings', 'editor'

  // Initialize BlockNote editor
  useEffect(() => {
    const newEditor = BlockNoteEditor.create({
      initialContent: card.content || undefined,
    });
    setEditor(newEditor);
    // Small delay to ensure proper rendering
    setTimeout(() => setIsLoading(false), 50);
  }, []);

  const handleCardClick = (e) => {
    // Only open editor if clicking on the card content area (not buttons)
    if (!e.target.closest('button') && !e.target.closest('i') && viewState === 'front') {
      // If it's a workspace card, open it fullscreen
      if (card.type === 'th') {
        // Get the parent Workspace component's setActiveWorkspace function
        const workspaceElement = document.querySelector('.workspace-body');
        if (workspaceElement) {
          // Dispatch a custom event to notify the workspace
          const event = new CustomEvent('openWorkspace', { 
            detail: { card, columnId } 
          });
          workspaceElement.dispatchEvent(event);
        }
      } else {
        setViewState('editor');
      }
    }
  };

  const handleCloseEditor = () => {
    setViewState('front');
  };

  const handleFlip = () => {
    setViewState(viewState === 'settings' ? 'front' : 'settings');
  };

  // Card drag logic - EXACTLY like original
  useEffect(() => {
    if (!cardRef.current) return;
    
    let isDragging = false;
    let isProcessingDrop = false;
    
    const handleMouseDown = (e) => {
      if (e.target.closest('.card-delete')) return;
      
      const startX = e.clientX;
      const startY = e.clientY;
      const card = cardRef.current;
      
      // Store original dimensions immediately
      const originalWidth = card.offsetWidth;
      const originalHeight = card.offsetHeight;
      
      let dragTimeout = setTimeout(() => {
        isDragging = true;
        card.classList.add('dragging');
        window.cardDragging = true;
        
        // Position card absolutely to follow mouse with original dimensions
        card.style.position = 'fixed';
        card.style.zIndex = '1000';
        card.style.width = originalWidth + 'px';
        card.style.height = originalHeight + 'px';
        card.style.left = (e.clientX - originalWidth/2) + 'px';
        card.style.top = (e.clientY - 20) + 'px';
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.8';
        card.style.transform = 'scale(0.95)';
        card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4)';
      }, 200);
      
      let hoveredCard = null;
      let hoverTimeout = null;
      
      const onMouseMove = (e) => {
        if (isDragging) {
          // Move card with mouse using original dimensions
          card.style.left = (e.clientX - originalWidth/2) + 'px';
          card.style.top = (e.clientY - 20) + 'px';
          
          // Find if hovering over another card
          const allCards = document.querySelectorAll('.card:not(.dragging)');
          let currentHoveredCard = null;
          
          allCards.forEach(otherCard => {
            const rect = otherCard.getBoundingClientRect();
            if (e.clientX >= rect.left && e.clientX <= rect.right &&
                e.clientY >= rect.top && e.clientY <= rect.bottom) {
              currentHoveredCard = otherCard;
            }
          });
          
          // Check if we're hovering over a new card
          if (currentHoveredCard !== hoveredCard) {
            // Clear previous hover timeout
            if (hoverTimeout) {
              clearTimeout(hoverTimeout);
              if (hoveredCard) {
                hoveredCard.style.background = '';
                hoveredCard.classList.remove('merge-target');
              }
            }
            
            hoveredCard = currentHoveredCard;
            
            // Start hover timer if over a card
            if (hoveredCard) {
              hoveredCard.classList.add('merge-target');
              
              hoverTimeout = setTimeout(() => {
                hoveredCard.style.background = 'rgba(255, 255, 255, 0.15)';
              }, 1500);
            }
          }
          
          // Just track drop position without visual indicators
        } else if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
          clearTimeout(dragTimeout);
        }
      };
      
      const onMouseUp = (e) => {
        clearTimeout(dragTimeout);
        if (hoverTimeout) clearTimeout(hoverTimeout);
        
        if (isDragging && !isProcessingDrop) {
          isProcessingDrop = true;
          // Reset card style
          card.style.position = '';
          card.style.zIndex = '';
          card.style.width = '';
          card.style.height = '';
          card.style.left = '';
          card.style.top = '';
          card.style.pointerEvents = '';
          card.style.opacity = '';
          card.style.transform = '';
          card.style.boxShadow = '';
          
          // Check if we should merge cards into a stack
          if (hoveredCard && hoveredCard.style.background) {
            // Get the hovered card's data
            const hoveredCardId = hoveredCard.dataset.cardId;
            const hoveredColumnId = hoveredCard.dataset.columnId;
            const draggedCardId = card.dataset.cardId;
            const draggedColumnId = card.dataset.columnId;
            
            // Update the React state to make the hovered card a stack
            // This would need to be done through a callback to the parent
            // For now, we'll just update the DOM to show it's a stack
            
            // Create nested column INSIDE the parent column
            const parentColumnContent = hoveredCard.parentElement;
            
            // Create nested column element
            const nestedColumn = document.createElement('div');
            const nestedColumnId = `nested-col-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const hoveredCardText = hoveredCard.querySelector('.card-text')?.textContent || 'Nested Group';
            nestedColumn.className = 'qwanyx-column nested-column';
            nestedColumn.dataset.columnId = nestedColumnId;
            nestedColumn.innerHTML = `
              <div class="drop-zone left"></div>
              <div class="drop-zone right"></div>
              <div class="column-header">
                <button class="header-burger"><i class="fas fa-bars"></i></button>
                <span class="header-title">${hoveredCardText}</span>
                <button class="header-close"><i class="fas fa-times"></i></button>
              </div>
              <div class="column-content"></div>
            `;
            
            // Style it as nested
            nestedColumn.style.cssText = `
              margin: 10px 0;
              width: 100%;
              min-width: unset;
              height: auto;
              padding: 10px;
              background: rgba(255, 255, 255, 0.15);
            `;
            
            const nestedContent = nestedColumn.querySelector('.column-content');
            nestedContent.style.cssText = `
              overflow: visible;
              height: auto;
              flex: unset;
              min-height: 0;
            `;
            
            // Move both cards into the nested column
            nestedContent.appendChild(hoveredCard);
            nestedContent.appendChild(card);
            
            // Update card data attributes to reflect new parent
            hoveredCard.dataset.columnId = nestedColumnId;
            card.dataset.columnId = nestedColumnId;
            
            // Insert nested column where the hovered card was
            parentColumnContent.appendChild(nestedColumn);
            
            // Make the nested column draggable
            makeColumnDraggable(nestedColumn);
            
            // Clean up
            hoveredCard.style.background = '';
            hoveredCard.classList.remove('merge-target');
          } else {
            // Find where to drop the card
            let targetColumn = null;
            let targetPosition = null;
            
            const columns = document.querySelectorAll('.qwanyx-column');
            columns.forEach(col => {
              const rect = col.getBoundingClientRect();
              if (e.clientX >= rect.left && e.clientX <= rect.right &&
                  e.clientY >= rect.top && e.clientY <= rect.bottom) {
                targetColumn = col.querySelector('.column-content');
              }
            });
            
            if (!targetColumn) {
              // Dropped outside - create new column  
              const cardText = card.querySelector('.card-text')?.textContent || 'New Column';
              const cardType = card.dataset.type || 'pen';
              
              // Get the source column ID from the card's current parent
              const sourceColumnEl = card.closest('.qwanyx-column');
              const sourceColumnId = sourceColumnEl?.dataset.columnId;
              
              // Create new column with card's text as title
              onAddColumn(cardText);
              
              // Wait for column to be created then move card via state
              setTimeout(() => {
                const newColumns = columns;
                if (newColumns.length > 0) {
                  const newColumnId = newColumns[newColumns.length - 1].id;
                  // Move card in state
                  if (sourceColumnId && newColumnId) {
                    // Find the card data
                    const cardData = cards[sourceColumnId]?.find(c => c.id === card.dataset.cardId);
                    if (cardData) {
                      onMoveCard(sourceColumnId, newColumnId, cardData);
                    }
                  }
                }
              }, 150); // Wait for debounce to complete
            } else {
              // Get source and target column IDs
              const sourceColumnEl = card.closest('.qwanyx-column');
              const sourceColumnId = sourceColumnEl?.dataset.columnId;
              const targetColumnEl = targetColumn.closest('.qwanyx-column');
              const targetColumnId = targetColumnEl?.dataset.columnId;
              
              if (sourceColumnId && targetColumnId) {
                // Update the card's data attribute to reflect new column
                card.dataset.columnId = targetColumnId;
                
                // Find the card data
                const cardElement = card;
                const cardId = cardElement.dataset.cardId;
                
                // Simply move the DOM element for now
                // The real fix would be to fully sync state, but that's complex
                targetColumn.appendChild(card);
              }
            }
          }
        }
        
        // Clean up
        card.classList.remove('dragging');
        isDragging = false;
        isProcessingDrop = false;
        window.cardDragging = false;
        
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };
      
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    };
    
    cardRef.current.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousedown', handleMouseDown);
      }
    };
  }, [onAddColumn]);

  return (
    <div 
      className={`card ${viewState === 'settings' ? 'flipped' : ''} ${viewState === 'editor' ? 'editing' : ''}`}
      ref={cardRef} 
      data-type={card.type}
      data-card-id={card.id}
      data-column-id={columnId}
      style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.2s' }}
    >
      <div className="card-flipper">
        <div className="card-front" onClick={viewState === 'editor' ? null : handleCardClick}>
          {viewState === 'editor' ? (
            <CardEditor 
              card={card}
              editor={editor}
              onClose={handleCloseEditor}
            />
          ) : (
            <CardFront
              card={card}
              onDuplicate={() => {
                const currentColumn = cardRef.current?.closest('.qwanyx-column');
                const currentColumnId = currentColumn?.dataset.columnId || columnId;
                onDuplicate(currentColumnId);
              }}
              onToggleExpanded={onToggleExpanded}
              onRemove={onRemove}
              onFlip={handleFlip}
            />
          )}
          {card.isStack && card.isExpanded && card.children && card.children.length > 0 && (
            <div className="card-children" style={{ marginTop: '10px', paddingLeft: '10px' }}>
              {card.children.map(childCard => (
                <Card
                  key={childCard.id}
                  card={childCard}
                  columnId={columnId}
                  onRemove={() => {/* Handle child removal */}}
                  onDuplicate={() => {/* Handle child duplication */}}
                  onMoveCard={onMoveCard}
                  onToggleExpanded={() => {/* Handle child toggle */}}
                  onToggleShowBrief={() => {/* Handle child show brief */}}
                  onUpdateCardType={() => {/* Handle child type update */}}
                  contentRef={contentRef}
                  containerRef={containerRef}
                  onAddColumn={onAddColumn}
                />
              ))}
            </div>
          )}
        </div>
        <div className="card-back">
          <CardSettings
            card={card}
            editor={editor}
            onToggleShowBrief={onToggleShowBrief}
            onUpdateCardType={onUpdateCardType}
            onFlip={handleFlip}
          />
        </div>
      </div>
    </div>
  );
}

export default Workspace;