/**
 * 🎯 Page Component - The foundation of every view
 * 
 * This component defines the fundamental layout strategy for all pages.
 * It handles viewport, scrolling, background, and responsive behavior.
 * 
 * NO NATIVE HTML except the semantic <main> wrapper.
 */

import React from 'react';
import { parseStyleGrammar } from '../utils/styleGrammar';

export interface PageProps {
  children: React.ReactNode;
  
  // Layout Strategy
  layout?: 'fixed' | 'grow' | 'sections';
  
  // Scroll Behavior
  scroll?: 'normal' | 'smooth' | 'snap' | 'none';
  scrollbar?: boolean;
  scrollPadding?: string; // Style grammar: "lg" or "lg/top-xl"
  
  // Overflow
  overflowX?: 'visible' | 'hidden' | 'auto' | 'clip';
  overflowY?: 'visible' | 'hidden' | 'auto' | 'clip';
  
  // Background (Style Grammar)
  background?: string; // "primary/10/frost-md"
  backgroundImage?: string;
  backgroundAttachment?: 'fixed' | 'scroll' | 'local';
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: string;
  overlay?: string; // "dark/50" for overlay
  
  // Spacing (Style Grammar)
  padding?: string; // "lg" or "lg/x-none"
  gap?: string; // Space between children
  
  // Transitions
  fadeIn?: boolean;
  fadeInDuration?: number;
  
  // Responsive overrides
  responsive?: {
    mobile?: {
      layout?: 'fixed' | 'grow';
      padding?: string;
    };
    tablet?: {
      layout?: 'fixed' | 'grow';
      padding?: string;
    };
  };
  
  // Semantic
  as?: 'main' | 'article' | 'section' | 'div';
  id?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Page: React.FC<PageProps> = ({
  children,
  layout = 'grow',
  scroll = 'normal',
  scrollbar = true,
  scrollPadding,
  overflowX = 'hidden',
  overflowY = 'auto',
  background,
  backgroundImage,
  backgroundAttachment = 'scroll',
  backgroundSize = 'cover',
  backgroundPosition = 'center',
  overlay,
  padding,
  gap,
  fadeIn = true,
  fadeInDuration = 200,
  responsive,
  as: Component = 'main',
  id,
  className = '',
  style = {},
  ...props
}) => {
  // Parse style grammar
  const backgroundStyles = background ? parseStyleGrammar(background, 'color') : {};
  const paddingStyles = padding ? parseStyleGrammar(padding, 'spacing') : {};
  const scrollPaddingStyles = scrollPadding ? parseStyleGrammar(scrollPadding, 'spacing') : {};
  const gapValue = gap ? parseStyleGrammar(gap, 'spacing').padding : undefined;
  
  // Layout styles based on strategy
  const getLayoutStyles = (): React.CSSProperties => {
    switch (layout) {
      case 'fixed':
        return {
          height: '100dvh', // Dynamic viewport height with fallback
          overflow: 'hidden',
        };
      case 'grow':
        return {
          minHeight: '100dvh',
        };
      case 'sections':
        return {
          height: '100dvh',
          scrollSnapType: 'y mandatory',
          overflowY: 'scroll',
        };
      default:
        return {};
    }
  };
  
  // Scroll behavior styles
  const scrollStyles: React.CSSProperties = {
    scrollBehavior: scroll === 'smooth' ? 'smooth' : undefined,
    scrollSnapType: scroll === 'snap' ? 'y mandatory' : undefined,
    ...scrollPaddingStyles,
  };
  
  // Overflow styles
  const overflowStyles: React.CSSProperties = {
    overflowX,
    overflowY: layout === 'fixed' ? 'hidden' : overflowY,
  };
  
  // Background image styles
  const bgImageStyles: React.CSSProperties = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize,
    backgroundPosition,
    backgroundAttachment,
    backgroundRepeat: 'no-repeat',
  } : {};
  
  // Animation styles
  const animationStyles: React.CSSProperties = fadeIn ? {
    animation: `pageIn ${fadeInDuration}ms ease-out`,
  } : {};
  
  // Combine all styles
  const pageStyles: React.CSSProperties = {
    ...getLayoutStyles(),
    ...scrollStyles,
    ...overflowStyles,
    ...backgroundStyles,
    ...bgImageStyles,
    ...paddingStyles,
    ...animationStyles,
    display: 'flex',
    flexDirection: 'column',
    gap: gapValue,
    position: 'relative',
    ...style,
  };
  
  // Add responsive styles via CSS classes if needed
  const responsiveClass = responsive ? 'page--responsive' : '';
  
  return (
    <>
      <Component
        id={id}
        className={`qwanyx-page ${className} ${responsiveClass}`.trim()}
        style={pageStyles}
        data-layout={layout}
        data-scroll={scroll}
        {...props}
      >
        {/* Overlay if specified */}
        {overlay && (
          <div
            className="qwanyx-page__overlay"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              zIndex: 1,
              ...parseStyleGrammar(overlay, 'color'),
            }}
          />
        )}
        
        {/* Content */}
        <div 
          className="qwanyx-page__content"
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
          }}
        >
          {children}
        </div>
      </Component>
      
      {/* Inline keyframes for animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pageIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Hide scrollbar if requested */
        ${!scrollbar ? `
          .qwanyx-page::-webkit-scrollbar {
            display: none;
          }
          .qwanyx-page {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        ` : ''}
        
        /* Responsive overrides */
        ${responsive?.mobile ? `
          @media (max-width: 640px) {
            .page--responsive {
              ${responsive.mobile.layout ? `min-height: ${responsive.mobile.layout === 'fixed' ? '100vh' : 'auto'};` : ''}
              ${responsive.mobile.padding ? `padding: ${responsive.mobile.padding};` : ''}
            }
          }
        ` : ''}
        
        ${responsive?.tablet ? `
          @media (min-width: 641px) and (max-width: 1024px) {
            .page--responsive {
              ${responsive.tablet.layout ? `min-height: ${responsive.tablet.layout === 'fixed' ? '100vh' : 'auto'};` : ''}
              ${responsive.tablet.padding ? `padding: ${responsive.tablet.padding};` : ''}
            }
          }
        ` : ''}
      ` }} />
    </>
  );
};