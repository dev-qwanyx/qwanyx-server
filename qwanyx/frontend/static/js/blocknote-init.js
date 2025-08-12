import { BlockNoteEditor } from "@blocknote/core";
import "@blocknote/mantine/style.css";

// Store editors globally
window.cardEditors = new Map();

// Create editor for a card
window.createBlockNoteEditor = async function(cardId) {
    // Check if editor already exists
    if (window.cardEditors.has(cardId)) {
        return window.cardEditors.get(cardId);
    }
    
    const container = document.getElementById(`editor-${cardId}`);
    if (!container) {
        console.error('Container not found for', cardId);
        return;
    }
    
    // Create the editor with BlockNoteEditor.create()
    const editor = BlockNoteEditor.create();
    
    // Mount directly to container
    editor.mount(container);
    
    // Store reference
    window.cardEditors.set(cardId, editor);
    
    // Apply dark theme styles to container
    container.classList.add('bn-container');
    container.style.background = 'rgba(255, 255, 255, 0.05)';
    container.style.borderRadius = '6px';
    container.style.padding = '8px';
    container.style.minHeight = '60px';
    
    // Save on change (debounced)
    let saveTimeout;
    editor.onChange(() => {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            const content = editor.document;
            console.log('Saving content for', cardId, content);
            // TODO: Save to database
        }, 1000);
    });
    
    console.log('Editor created for', cardId);
    return editor;
};