import type { Plugin } from 'vite';

export function useClientPlugin(): Plugin {
  return {
    name: 'use-client',
    generateBundle(_, bundle) {
      for (const [fileName, chunk] of Object.entries(bundle)) {
        if (chunk.type === 'chunk' && (fileName.endsWith('.mjs') || fileName.endsWith('.js'))) {
          chunk.code = `'use client';\n${chunk.code}`;
        }
      }
    }
  };
}