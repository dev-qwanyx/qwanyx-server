/**
 * GlobalStyles Component
 * Injects CSS reset and global styles
 */

import React from 'react';

export const GlobalStyles = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      /* Box sizing rules */
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      /* Remove default margin and padding */
      * {
        margin: 0;
        padding: 0;
      }

      /* Set core root defaults */
      html {
        scroll-behavior: smooth;
        -webkit-text-size-adjust: 100%;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }

      /* Set core body defaults */
      body {
        min-height: 100vh;
        min-height: 100dvh;
        line-height: 1.5;
        font-family: 
          -apple-system,
          BlinkMacSystemFont,
          'Segoe UI',
          'Roboto',
          'Oxygen',
          'Ubuntu',
          'Cantarell',
          'Fira Sans',
          'Droid Sans',
          'Helvetica Neue',
          sans-serif;
        background-color: rgb(var(--background, 249, 250, 251));
        color: rgb(var(--foreground, 15, 23, 42));
        overflow-x: hidden;
      }

      /* Remove list styles */
      ul,
      ol {
        list-style: none;
      }

      /* Make images easier to work with */
      img,
      picture,
      video,
      canvas,
      svg {
        display: block;
        max-width: 100%;
        height: auto;
      }

      /* Inherit fonts for form controls */
      input,
      button,
      textarea,
      select {
        font: inherit;
        color: inherit;
      }

      /* Remove default button styling */
      button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 0;
      }

      /* Prevent textarea resize beyond container */
      textarea {
        resize: vertical;
      }

      /* Remove default link styling but keep accessibility */
      a {
        color: inherit;
        text-decoration: none;
      }

      /* Focus styles for accessibility */
      :focus-visible {
        outline: 2px solid rgb(var(--primary, 59, 130, 246));
        outline-offset: 2px;
        border-radius: var(--radius-sm, 0.125rem);
      }

      /* Remove focus for mouse users */
      :focus:not(:focus-visible) {
        outline: none;
      }

      /* Respect user's motion preferences */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        :focus-visible {
          outline-width: 3px;
        }
      }

      /* Selection colors using theme */
      ::selection {
        background-color: rgb(var(--primary, 59, 130, 246) / 0.2);
        color: rgb(var(--foreground, 15, 23, 42));
      }

      /* Ensure full height for Next.js/React roots */
      #__next,
      #root,
      [data-qwanyx-app] {
        min-height: 100vh;
        min-height: 100dvh;
      }

      /* Scrollbar Styling - Webkit */
      ::-webkit-scrollbar {
        width: var(--scrollbar-width, 8px);
        height: var(--scrollbar-width, 8px);
      }

      ::-webkit-scrollbar-track {
        background: rgb(var(--scrollbar-track, var(--background)));
        border-radius: var(--radius-full, 9999px);
      }

      ::-webkit-scrollbar-thumb {
        background: rgb(var(--scrollbar-thumb, var(--border)));
        border-radius: var(--radius-full, 9999px);
        transition: background var(--transition-fast, 150ms ease);
      }

      ::-webkit-scrollbar-thumb:hover {
        background: rgb(var(--scrollbar-thumb-hover, var(--primary)));
      }

      ::-webkit-scrollbar-corner {
        background: rgb(var(--scrollbar-track, var(--background)));
      }

      /* Scrollbar Styling - Firefox */
      * {
        scrollbar-width: thin;
        scrollbar-color: rgb(var(--scrollbar-thumb, var(--border))) rgb(var(--scrollbar-track, var(--background)));
      }
    ` }} />
  );
};