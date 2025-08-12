import React from 'react';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  children,
  size = 'xl',
  padding = 'md',
  center = true,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-container',
    `qwanyx-container--${size}`,
    padding !== 'none' && `qwanyx-container--padding-${padding}`,
    center && 'qwanyx-container--center',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  fullHeight?: boolean;
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  children,
  spacing = 'lg',
  fullHeight = false,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-section',
    spacing !== 'none' && `qwanyx-section--spacing-${spacing}`,
    fullHeight && 'qwanyx-section--fullheight',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <section ref={ref} className={combinedClassName} {...props}>
      {children}
    </section>
  );
});

Section.displayName = 'Section';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  children,
  cols = 3,
  gap = 'md',
  responsive = true,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-grid',
    `qwanyx-grid--cols-${cols}`,
    responsive && 'qwanyx-grid--responsive',
    gap !== 'none' && `qwanyx-grid--gap-${gap}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  fullHeight?: boolean;
}

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
  children,
  direction = 'row',
  wrap = 'nowrap',
  justify = 'start',
  align = 'stretch',
  gap = 'none',
  fullWidth = false,
  fullHeight = false,
  className = '',
  ...props
}, ref) => {
  const combinedClassName = [
    'qwanyx-flex',
    `qwanyx-flex--${direction}`,
    `qwanyx-flex--${wrap}`,
    `qwanyx-flex--justify-${justify}`,
    `qwanyx-flex--align-${align}`,
    gap !== 'none' && `qwanyx-flex--gap-${gap}`,
    fullWidth && 'qwanyx-flex--fullwidth',
    fullHeight && 'qwanyx-flex--fullheight',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div ref={ref} className={combinedClassName} {...props}>
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';