import React, { useEffect, useRef, useState } from 'react';

export interface AnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 
    // Attention seekers
    | 'bounce' | 'flash' | 'pulse' | 'rubberBand' | 'shakeX' | 'shakeY' 
    | 'headShake' | 'swing' | 'tada' | 'wobble' | 'jello' | 'heartBeat'
    // Back entrances
    | 'backInDown' | 'backInLeft' | 'backInRight' | 'backInUp'
    // Back exits
    | 'backOutDown' | 'backOutLeft' | 'backOutRight' | 'backOutUp'
    // Bouncing entrances
    | 'bounceIn' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' | 'bounceInUp'
    // Bouncing exits
    | 'bounceOut' | 'bounceOutDown' | 'bounceOutLeft' | 'bounceOutRight' | 'bounceOutUp'
    // Fading entrances
    | 'fadeIn' | 'fadeInDown' | 'fadeInDownBig' | 'fadeInLeft' | 'fadeInLeftBig'
    | 'fadeInRight' | 'fadeInRightBig' | 'fadeInUp' | 'fadeInUpBig' | 'fadeInTopLeft'
    | 'fadeInTopRight' | 'fadeInBottomLeft' | 'fadeInBottomRight'
    // Fading exits
    | 'fadeOut' | 'fadeOutDown' | 'fadeOutDownBig' | 'fadeOutLeft' | 'fadeOutLeftBig'
    | 'fadeOutRight' | 'fadeOutRightBig' | 'fadeOutUp' | 'fadeOutUpBig'
    | 'fadeOutTopLeft' | 'fadeOutTopRight' | 'fadeOutBottomLeft' | 'fadeOutBottomRight'
    // Flippers
    | 'flip' | 'flipInX' | 'flipInY' | 'flipOutX' | 'flipOutY'
    // Lightspeed
    | 'lightSpeedInRight' | 'lightSpeedInLeft' | 'lightSpeedOutRight' | 'lightSpeedOutLeft'
    // Rotating entrances
    | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' | 'rotateInUpLeft' | 'rotateInUpRight'
    // Rotating exits
    | 'rotateOut' | 'rotateOutDownLeft' | 'rotateOutDownRight' | 'rotateOutUpLeft' | 'rotateOutUpRight'
    // Sliding entrances
    | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'slideInUp'
    // Sliding exits
    | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'slideOutUp'
    // Zoom entrances
    | 'zoomIn' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' | 'zoomInUp'
    // Zoom exits
    | 'zoomOut' | 'zoomOutDown' | 'zoomOutLeft' | 'zoomOutRight' | 'zoomOutUp'
    // Specials
    | 'hinge' | 'jackInTheBox' | 'rollIn' | 'rollOut';
  
  duration?: 'faster' | 'fast' | 'slow' | 'slower' | number;
  delay?: 'delay-1s' | 'delay-2s' | 'delay-3s' | 'delay-4s' | 'delay-5s' | number;
  repeat?: 'repeat-1' | 'repeat-2' | 'repeat-3' | 'infinite';
  triggerOnScroll?: boolean;
  triggerOnHover?: boolean;
  triggerOnClick?: boolean;
  as?: keyof React.JSX.IntrinsicElements;
}

export const Animated = React.forwardRef<HTMLDivElement, AnimatedProps>(({
  children,
  animation = 'fadeIn',
  duration,
  delay,
  repeat,
  triggerOnScroll = false,
  triggerOnHover = false,
  triggerOnClick = false,
  as: Component = 'div',
  className = '',
  ...props
}, ref) => {
  const [isAnimating, setIsAnimating] = useState(!triggerOnScroll && !triggerOnHover && !triggerOnClick);
  const elementRef = useRef<HTMLElement>(null);
  const combinedRef = ref || elementRef;
  
  // Build animation classes
  const animationClasses = [
    isAnimating && 'animate__animated',
    isAnimating && `animate__${animation}`,
    duration && typeof duration === 'string' && `animate__${duration}`,
    delay && typeof delay === 'string' && `animate__${delay}`,
    repeat && `animate__${repeat === 'infinite' ? 'infinite' : repeat}`,
  ].filter(Boolean).join(' ');
  
  // Handle custom duration and delay
  const style: React.CSSProperties = {
    ...props.style,
  };
  
  if (duration && typeof duration === 'number') {
    style.animationDuration = `${duration}ms`;
  }
  
  if (delay && typeof delay === 'number') {
    style.animationDelay = `${delay}ms`;
  }
  
  // Intersection Observer for scroll trigger
  useEffect(() => {
    if (!triggerOnScroll) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsAnimating(true);
            // Optionally disconnect after first trigger
            // observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    
    if (combinedRef && 'current' in combinedRef && combinedRef.current) {
      observer.observe(combinedRef.current);
    }
    
    return () => observer.disconnect();
  }, [triggerOnScroll, combinedRef]);
  
  // Handle hover trigger
  const handleMouseEnter = () => {
    if (triggerOnHover) {
      setIsAnimating(true);
    }
  };
  
  const handleMouseLeave = () => {
    if (triggerOnHover) {
      // Reset animation after it completes
      setTimeout(() => setIsAnimating(false), 1000);
    }
  };
  
  // Handle click trigger
  const handleClick = (e: React.MouseEvent) => {
    if (triggerOnClick) {
      setIsAnimating(false);
      // Force reflow
      void (combinedRef as any).current?.offsetHeight;
      setIsAnimating(true);
    }
    props.onClick?.(e as any);
  };
  
  const combinedClassName = [
    animationClasses,
    className
  ].filter(Boolean).join(' ');
  
  return React.createElement(
    Component as any,
    {
      ref: combinedRef,
      className: combinedClassName,
      style,
      onMouseEnter: triggerOnHover ? handleMouseEnter : props.onMouseEnter,
      onMouseLeave: triggerOnHover ? handleMouseLeave : props.onMouseLeave,
      onClick: triggerOnClick ? handleClick : props.onClick,
      ...props
    },
    children
  );
});

Animated.displayName = 'Animated';

// Utility component for easy animation on any element
export const AnimateOnScroll: React.FC<AnimatedProps> = (props) => (
  <Animated {...props} triggerOnScroll />
);

export const AnimateOnHover: React.FC<AnimatedProps> = (props) => (
  <Animated {...props} triggerOnHover />
);

export const AnimateOnClick: React.FC<AnimatedProps> = (props) => (
  <Animated {...props} triggerOnClick />
);