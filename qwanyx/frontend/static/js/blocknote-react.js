// BlockNote with React for full editor functionality
import React from "react";
import ReactDOM from "react-dom/client";
import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/mantine/style.css";

import {
  BlockNoteViewRaw,
  useCreateBlockNote,
  SuggestionMenuController,
  getDefaultReactSlashMenuItems
} from "@blocknote/react";

// Store editors globally
window.cardEditors = new Map();
window.editorRoots = new Map();

// BlockNote component
function BlockNoteEditorComponent({ cardId, initialContent }) {
  // Creates a new editor instance with all features
  const editor = useCreateBlockNote({
    initialContent: initialContent,
    uploadFile: async (file) => {
      // Handle file uploads
      const url = URL.createObjectURL(file);
      return url;
    }
  });

  // Store editor reference
  React.useEffect(() => {
    window.cardEditors.set(cardId, editor);
    
    // Save on change (debounced)
    let saveTimeout;
    const unsubscribe = editor.onChange(() => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        const content = editor.document;
        console.log('Saving content for', cardId, content);
        // TODO: Save to database
      }, 1000);
    });

    return () => {
      unsubscribe();
      window.cardEditors.delete(cardId);
    };
  }, [editor, cardId]);

  // Render editor with all UI components
  return (
    <BlockNoteViewRaw 
      editor={editor} 
      theme="dark"
      slashMenu={true}
      formattingToolbar={true}
      linkToolbar={true}
      sideMenu={true}
    >
      <SuggestionMenuController 
        triggerCharacter="/"
        getItems={async (query) => {
          return getDefaultReactSlashMenuItems(editor).filter(
            (item) => item.title.toLowerCase().includes(query.toLowerCase())
          );
        }}
      />
    </BlockNoteViewRaw>
  );
}

// Create editor function
window.createBlockNoteEditor = async function(cardId) {
  try {
    // Check if editor already exists
    if (window.editorRoots.has(cardId)) {
      return window.cardEditors.get(cardId);
    }
    
    const container = document.getElementById(`editor-${cardId}`);
    if (!container) {
      console.error('Container not found for', cardId);
      return;
    }
    
    // Apply container styles
    container.classList.add('bn-container');
    container.setAttribute('data-color-scheme', 'dark');
    container.style.background = 'rgba(255, 255, 255, 0.05)';
    container.style.borderRadius = '6px';
    container.style.padding = '10px';
    container.style.minHeight = '100px';
    
    // Create React root and render editor
    const root = ReactDOM.createRoot(container);
    window.editorRoots.set(cardId, root);
    
    root.render(
      <BlockNoteEditorComponent 
        cardId={cardId} 
        initialContent={[
          {
            type: "paragraph",
            content: "Start typing..."
          }
        ]}
      />
    );
    
    console.log('BlockNote editor created for', cardId);
    return true;
    
  } catch (error) {
    console.error('Error creating BlockNote editor:', error);
    return null;
  }
};

console.log('BlockNote React module loaded');