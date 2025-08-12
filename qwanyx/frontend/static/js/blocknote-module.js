// BlockNote module for QWANYX
import { BlockNoteEditor, defaultBlockSpecs } from "@blocknote/core";
import { getDefaultSlashMenuItems } from "@blocknote/core";
import "@blocknote/core/fonts.css";
import "@blocknote/react/style.css";

// Export to window for global access
window.BlockNoteEditor = BlockNoteEditor;

// Store editors globally
window.cardEditors = new Map();

// Create editor function
window.createBlockNoteEditor = async function(cardId) {
    try {
        // Check if editor already exists
        if (window.cardEditors.has(cardId)) {
            return window.cardEditors.get(cardId);
        }
        
        const container = document.getElementById(`editor-${cardId}`);
        if (!container) {
            console.error('Container not found for', cardId);
            return;
        }
        
        // Create the editor with configuration
        const editor = BlockNoteEditor.create({
            blockSpecs: defaultBlockSpecs,
            domAttributes: {
                editor: {
                    class: 'bn-editor bn-default-styles',
                    'data-color-scheme': 'dark'
                }
            },
            uploadFile: async (file) => {
                // Handle file uploads
                const url = URL.createObjectURL(file);
                return url;
            }
        });
        
        // Mount directly to container
        editor.mount(container);
        
        // Apply container styles
        container.classList.add('bn-container', 'bn-default-styles');
        container.setAttribute('data-color-scheme', 'dark');
        container.style.background = 'rgba(255, 255, 255, 0.05)';
        container.style.borderRadius = '6px';
        container.style.padding = '10px';
        container.style.minHeight = '100px';
        
        // Store reference
        window.cardEditors.set(cardId, editor);
        
        // Save on change (debounced)
        let saveTimeout;
        editor.onChange(() => {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                const content = editor.document;
                console.log('Saving content for', cardId, content);
            }, 1000);
        });
        
        console.log('BlockNote editor created for', cardId);
        return editor;
        
    } catch (error) {
        console.error('Error creating BlockNote editor:', error);
        return null;
    }
};

console.log('BlockNote module loaded');