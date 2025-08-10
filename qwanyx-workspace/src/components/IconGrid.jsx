import React, { useEffect } from 'react';

export const ICON_TYPES = ['pen', 'microphone', 'camera', 'comment', 'envelope', 'graduation-cap', 'address-book', 'users', 'project-diagram', 'robot', 'search', 'th'];
export const ICONS = ['fa-pen', 'fa-microphone', 'fa-camera', 'fa-comment', 'fa-envelope', 'fa-graduation-cap', 'fa-address-book', 'fa-users', 'fa-project-diagram', 'fa-robot', 'fa-search', 'fa-th'];

function IconGrid({ onSelectIcon, containerRef, onAddColumn }) {
  useEffect(() => {
    const buttons = document.querySelectorAll('.icon-grid-wrapper .control-btn');
    const handlers = [];
    
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
          dragGhost.innerHTML = `<i class="fas ${ICONS[index]}"></i>`;
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
              onAddColumn(ICON_TYPES[index]);
            }
            
            dragGhost.remove();
            dragGhost = null;
            btn.style.opacity = '1';
          } else if (!isDragging) {
            // It was a click
            onSelectIcon(ICON_TYPES[index], ICONS[index]);
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
      handlers.push({ btn, handler: handleMouseDown });
    });
    
    // Cleanup to remove event listeners
    return () => {
      handlers.forEach(({ btn, handler }) => {
        if (btn) btn.removeEventListener('mousedown', handler);
      });
    };
  }, [onSelectIcon, onAddColumn]);

  return (
    <div className="icon-grid-wrapper">
      <div className="icon-grid">
        {ICON_TYPES.map((type, index) => (
          <button
            key={type}
            className="control-btn"
            data-type={type}
          >
            <i className={`fas ${ICONS[index]}`}></i>
          </button>
        ))}
      </div>
    </div>
  );
}

export default IconGrid;