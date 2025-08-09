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
  const [velocity, setVelocity] = useState(0);
  const animationFrameRef = useRef(null);

  // Add initial column on mount
  useEffect(() => {
    if (columns.length === 0) {
      addColumn();
    }
  }, []);

  // Add a new column
  const addColumn = (type = null) => {
    const newCount = columnCount + 1;
    setColumnCount(newCount);
    
    const newColumn = {
      id: `col-${Date.now()}`,
      title: type ? `${type.charAt(0).toUpperCase() + type.slice(1)} Column` : `Column ${newCount}`,
    };
    
    setColumns(prevColumns => [...prevColumns, newColumn]);
  };

  // Remove a column
  const removeColumn = (columnId) => {
    if (columns.length > 1) {
      setColumns(columns.filter(c => c.id !== columnId));
    }
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

  return (
    <div className="workspace-body">
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
            onRemove={() => removeColumn(column.id)}
            containerRef={containerRef}
            onAddColumn={addColumn}
          />
        ))}
      </div>
    </div>
  );
}

// Column Component - handles its own drag logic
function Column({ column, onRemove, containerRef, onAddColumn }) {
  const [showIconGrid, setShowIconGrid] = useState(false);
  const [cards, setCards] = useState([]);
  const columnRef = useRef(null);
  const contentRef = useRef(null);

  // Add initial card
  useEffect(() => {
    addCard('pen', 'fa-pen');
  }, []);

  const addCard = (type, icon) => {
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
    
    setCards(prevCards => [...prevCards, newCard]);
  };

  const removeCard = (cardId) => {
    setCards(cards.filter(c => c.id !== cardId));
  };

  const duplicateCard = (card) => {
    addCard(card.type, card.icon);
  };

  // Column drag logic (similar to original)
  useEffect(() => {
    if (!columnRef.current) return;
    
    let isDraggingColumn = false;
    let dragStartX = 0;
    let columnGhost = null;
    
    const handleColumnMouseDown = (e) => {
      // Don't start if clicking on buttons, header, cards, or icon grid
      if (e.target.closest('.header-close') || 
          e.target.closest('.column-header') || 
          e.target.closest('.card') || 
          e.target.closest('.icon-grid-wrapper')) {
        return;
      }
      
      dragStartX = e.clientX;
      const startY = e.clientY;
      
      let dragTimeout = setTimeout(() => {
        isDraggingColumn = true;
        window.columnDragging = true;
        columnRef.current.classList.add('dragging');
        
        // Create ghost column
        columnGhost = document.createElement('div');
        columnGhost.className = 'column-ghost';
        columnGhost.innerHTML = columnRef.current.innerHTML;
        columnGhost.style.cssText = `
          position: fixed;
          width: 520px;
          height: 300px;
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(74, 158, 255, 0.5);
          border-radius: 10px;
          z-index: 10000;
          pointer-events: none;
          opacity: 0.8;
        `;
        columnGhost.style.left = (e.clientX - 250) + 'px';
        columnGhost.style.top = (e.clientY - 100) + 'px';
        document.body.appendChild(columnGhost);
        
        document.body.style.userSelect = 'none';
      }, 400); // Longer delay for column drag
      
      const onMouseMove = (e) => {
        if (isDraggingColumn && columnGhost) {
          columnGhost.style.left = (e.clientX - 250) + 'px';
          columnGhost.style.top = (e.clientY - 100) + 'px';
          
          // Show drop zones
          const columns = document.querySelectorAll('.qwanyx-column:not(.dragging)');
          columns.forEach(col => {
            const rect = col.getBoundingClientRect();
            const midpoint = rect.left + rect.width / 2;
            
            col.querySelectorAll('.drop-zone').forEach(zone => zone.classList.remove('active'));
            
            if (e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50) {
              if (e.clientX < midpoint) {
                col.querySelector('.drop-zone.left')?.classList.add('active');
              } else {
                col.querySelector('.drop-zone.right')?.classList.add('active');
              }
            }
          });
        } else if (Math.abs(e.clientX - dragStartX) > 5 || Math.abs(e.clientY - startY) > 5) {
          clearTimeout(dragTimeout);
        }
      };
      
      const onMouseUp = (e) => {
        clearTimeout(dragTimeout);
        
        if (isDraggingColumn && columnGhost) {
          // Find drop position and reorder columns in parent
          // This would need parent state management
          
          columnRef.current.classList.remove('dragging');
          document.body.style.userSelect = '';
          
          document.querySelectorAll('.drop-zone').forEach(zone => zone.classList.remove('active'));
          
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
    
    columnRef.current.addEventListener('mousedown', handleColumnMouseDown);
    
    return () => {
      if (columnRef.current) {
        columnRef.current.removeEventListener('mousedown', handleColumnMouseDown);
      }
    };
  }, []);

  const iconTypes = ['pen', 'microphone', 'camera', 'comment', 'envelope', 'graduation-cap', 'address-book', 'users', 'project-diagram', 'robot', 'search'];
  const icons = ['fa-pen', 'fa-microphone', 'fa-camera', 'fa-comment', 'fa-envelope', 'fa-graduation-cap', 'fa-address-book', 'fa-users', 'fa-project-diagram', 'fa-robot', 'fa-search'];

  return (
    <div className="qwanyx-column" ref={columnRef}>
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
        <button className="header-close" onClick={onRemove}>
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="column-content" ref={contentRef}>
        {showIconGrid && (
          <IconGrid 
            iconTypes={iconTypes}
            icons={icons}
            onSelectIcon={(type, icon) => {
              addCard(type, icon);
              setShowIconGrid(false);
            }}
            containerRef={containerRef}
            onAddColumn={onAddColumn}
          />
        )}
        
        {cards.map((card) => (
          <Card 
            key={card.id}
            card={card}
            onRemove={() => removeCard(card.id)}
            onDuplicate={() => duplicateCard(card)}
            contentRef={contentRef}
            containerRef={containerRef}
            onAddColumn={onAddColumn}
          />
        ))}
      </div>
    </div>
  );
}

// Icon Grid with drag to create columns
function IconGrid({ iconTypes, icons, onSelectIcon, containerRef, onAddColumn }) {
  useEffect(() => {
    const buttons = document.querySelectorAll('.icon-grid-wrapper .control-btn');
    
    buttons.forEach((btn, index) => {
      let isDragging = false;
      let dragGhost = null;
      
      const handleMouseDown = (e) => {
        const startX = e.clientX;
        const startY = e.clientY;
        
        let dragTimeout = setTimeout(() => {
          isDragging = true;
          window.iconDragging = true;
          
          dragGhost = document.createElement('div');
          dragGhost.className = 'drag-ghost';
          dragGhost.innerHTML = `<i class="fas ${icons[index]}"></i>`;
          dragGhost.style.cssText = `
            position: fixed;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            pointer-events: none;
            z-index: 10000;
            color: white;
            font-size: 24px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.4);
          `;
          dragGhost.style.left = (e.clientX - 30) + 'px';
          dragGhost.style.top = (e.clientY - 30) + 'px';
          document.body.appendChild(dragGhost);
          
          btn.style.opacity = '0.3';
        }, 200);
        
        const onMouseMove = (e) => {
          if (isDragging && dragGhost) {
            dragGhost.style.left = (e.clientX - 30) + 'px';
            dragGhost.style.top = (e.clientY - 30) + 'px';
          } else if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
            clearTimeout(dragTimeout);
          }
        };
        
        const onMouseUp = (e) => {
          clearTimeout(dragTimeout);
          
          if (isDragging && dragGhost) {
            const columns = document.querySelectorAll('.qwanyx-column');
            let droppedOnColumn = false;
            
            columns.forEach(col => {
              const rect = col.getBoundingClientRect();
              if (e.clientX >= rect.left && e.clientX <= rect.right &&
                  e.clientY >= rect.top && e.clientY <= rect.bottom) {
                droppedOnColumn = true;
              }
            });
            
            if (!droppedOnColumn) {
              onAddColumn(iconTypes[index]);
            }
            
            dragGhost.remove();
            dragGhost = null;
            btn.style.opacity = '1';
          } else if (!isDragging) {
            // It was a click
            onSelectIcon(iconTypes[index], icons[index]);
          }
          
          isDragging = false;
          window.iconDragging = false;
          
          document.removeEventListener('mousemove', onMouseMove);
          document.removeEventListener('mouseup', onMouseUp);
        };
        
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        
        e.preventDefault();
      };
      
      btn.addEventListener('mousedown', handleMouseDown);
    });
  }, []);

  return (
    <div className="icon-grid-wrapper">
      <div className="icon-grid">
        {iconTypes.map((type, index) => (
          <button
            key={type}
            className="control-btn"
            data-type={type}
          >
            <i className={`fas ${icons[index]}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}

// Card Component - handles its own drag logic
function Card({ card, onRemove, onDuplicate, contentRef, containerRef, onAddColumn }) {
  const cardRef = useRef(null);
  const [editor, setEditor] = useState(null);

  // Initialize BlockNote editor
  useEffect(() => {
    const newEditor = BlockNoteEditor.create({
      initialContent: card.content || undefined,
    });
    setEditor(newEditor);
  }, []);

  // Card drag logic - EXACTLY like original
  useEffect(() => {
    if (!cardRef.current) return;
    
    let isDragging = false;
    let placeholder = null;
    
    const handleMouseDown = (e) => {
      if (e.target.closest('.card-delete')) return;
      
      const startX = e.clientX;
      const startY = e.clientY;
      const card = cardRef.current;
      
      let dragTimeout = setTimeout(() => {
        isDragging = true;
        card.classList.add('dragging');
        window.cardDragging = true;
        
        // Create placeholder
        placeholder = document.createElement('div');
        placeholder.className = 'card-placeholder';
        placeholder.style.cssText = `
          height: ${card.offsetHeight}px;
          margin-bottom: 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 2px dashed rgba(255, 255, 255, 0.2);
          border-radius: 8px;
        `;
        card.parentElement.insertBefore(placeholder, card);
        
        // Position card absolutely to follow mouse
        card.style.position = 'fixed';
        card.style.zIndex = '1000';
        card.style.width = card.offsetWidth + 'px';
        card.style.left = (e.clientX - card.offsetWidth/2) + 'px';
        card.style.top = (e.clientY - 20) + 'px';
        card.style.pointerEvents = 'none';
      }, 200);
      
      let hoveredCard = null;
      let hoverTimeout = null;
      
      const onMouseMove = (e) => {
        if (isDragging) {
          // Move card with mouse
          card.style.left = (e.clientX - card.offsetWidth/2) + 'px';
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
          
          // Normal reordering logic
          if (!hoveredCard || !hoverTimeout) {
            let closestCard = null;
            let closestDistance = Infinity;
            let insertBefore = true;
            
            allCards.forEach(otherCard => {
              const rect = otherCard.getBoundingClientRect();
              const midY = rect.top + rect.height / 2;
              const distance = Math.abs(e.clientY - midY);
              
              if (distance < closestDistance && e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50) {
                closestDistance = distance;
                closestCard = otherCard;
                insertBefore = e.clientY < midY;
              }
            });
            
            // Check columns for positioning
            const columns = document.querySelectorAll('.column-content');
            columns.forEach(col => {
              const rect = col.getBoundingClientRect();
              if (e.clientX >= rect.left && e.clientX <= rect.right &&
                  e.clientY >= rect.top && e.clientY <= rect.bottom) {
                if (col.children.length === 0 || (col.children.length === 1 && col.contains(placeholder))) {
                  col.appendChild(placeholder);
                } else if (closestCard && closestCard.parentElement === col && !hoveredCard) {
                  if (insertBefore) {
                    col.insertBefore(placeholder, closestCard);
                  } else {
                    col.insertBefore(placeholder, closestCard.nextSibling);
                  }
                }
              }
            });
          }
        } else if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
          clearTimeout(dragTimeout);
        }
      };
      
      const onMouseUp = (e) => {
        clearTimeout(dragTimeout);
        if (hoverTimeout) clearTimeout(hoverTimeout);
        
        if (isDragging) {
          // Reset card style
          card.style.position = '';
          card.style.zIndex = '';
          card.style.width = '';
          card.style.left = '';
          card.style.top = '';
          card.style.pointerEvents = '';
          
          // Check if we should merge cards into a nested column
          if (hoveredCard && hoveredCard.style.background) {
            // Create nested column INSIDE the parent column
            const parentColumnContent = hoveredCard.parentElement;
            
            // Create nested column element
            const nestedColumn = document.createElement('div');
            nestedColumn.className = 'qwanyx-column nested-column';
            nestedColumn.innerHTML = `
              <div class="column-header">
                <button class="header-burger"><i class="fas fa-bars"></i></button>
                <span class="header-title">Nested Group</span>
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
            
            // Insert nested column where the hovered card was
            parentColumnContent.appendChild(nestedColumn);
            
            // Clean up
            hoveredCard.style.background = '';
            hoveredCard.classList.remove('merge-target');
            if (placeholder) placeholder.remove();
          } else if (placeholder) {
            // Check if dropped outside all columns
            let droppedOutside = true;
            const columns = document.querySelectorAll('.qwanyx-column');
            
            columns.forEach(col => {
              const rect = col.getBoundingClientRect();
              if (e.clientX >= rect.left && e.clientX <= rect.right &&
                  e.clientY >= rect.top && e.clientY <= rect.bottom) {
                droppedOutside = false;
              }
            });
            
            if (droppedOutside) {
              // Create a new column with the card
              const cardType = card.dataset.type || 'pen';
              onAddColumn(cardType);
              
              // Move card to new column (would need better state management)
              setTimeout(() => {
                const newColumn = containerRef.current.lastElementChild;
                const newColumnContent = newColumn.querySelector('.column-content');
                newColumnContent.appendChild(card);
              }, 100);
              
              placeholder.remove();
            } else {
              // Insert card at placeholder position
              placeholder.parentElement.insertBefore(card, placeholder);
              placeholder.remove();
            }
          }
        }
        
        // Clean up
        card.classList.remove('dragging');
        isDragging = false;
        window.cardDragging = false;
        placeholder = null;
        
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
    <div className="card" ref={cardRef} data-type={card.type}>
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
}

export default Workspace;