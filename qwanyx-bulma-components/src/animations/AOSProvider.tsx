import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

interface AOSProviderProps {
  children: React.ReactNode;
  duration?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: string;
  offset?: number;
  delay?: number;
}

export const AOSProvider: React.FC<AOSProviderProps> = ({ 
  children,
  duration = 1000,
  easing = 'ease-in-out',
  once = true,
  mirror = false,
  anchorPlacement = 'center-bottom',
  offset = 120,
  delay = 0
}) => {
  useEffect(() => {
    AOS.init({
      duration,
      easing,
      once,
      mirror,
      anchorPlacement,
      offset,
      delay,
      // Disable on mobile for better performance
      disable: 'mobile'
    });

    // Refresh AOS when component updates
    AOS.refresh();

    return () => {
      AOS.refresh();
    };
  }, [duration, easing, once, mirror, anchorPlacement, offset, delay]);

  return <>{children}</>;
};

// AOS Wrapper Component for easy use
interface AOSWrapperProps {
  children: React.ReactNode;
  animation?: string;
  duration?: number;
  delay?: number;
  offset?: number;
  easing?: string;
  once?: boolean;
  mirror?: boolean;
  anchorPlacement?: string;
  className?: string;
}

export const AOSWrapper: React.FC<AOSWrapperProps> = ({
  children,
  animation = 'fade-up',
  duration = 1000,
  delay = 0,
  offset = 120,
  easing = 'ease-in-out',
  once = true,
  mirror = false,
  anchorPlacement = 'center-bottom',
  className = ''
}) => {
  return (
    <div
      data-aos={animation}
      data-aos-duration={duration}
      data-aos-delay={delay}
      data-aos-offset={offset}
      data-aos-easing={easing}
      data-aos-once={once}
      data-aos-mirror={mirror}
      data-aos-anchor-placement={anchorPlacement}
      className={className}
    >
      {children}
    </div>
  );
};

// Preset AOS animations as components
export const FadeIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="fade" delay={delay}>{children}</AOSWrapper>
);

export const FadeUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="fade-up" delay={delay}>{children}</AOSWrapper>
);

export const FadeDown: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="fade-down" delay={delay}>{children}</AOSWrapper>
);

export const FadeLeft: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="fade-left" delay={delay}>{children}</AOSWrapper>
);

export const FadeRight: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="fade-right" delay={delay}>{children}</AOSWrapper>
);

export const SlideUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="slide-up" delay={delay}>{children}</AOSWrapper>
);

export const SlideDown: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="slide-down" delay={delay}>{children}</AOSWrapper>
);

export const SlideLeft: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="slide-left" delay={delay}>{children}</AOSWrapper>
);

export const SlideRight: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="slide-right" delay={delay}>{children}</AOSWrapper>
);

export const ZoomIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="zoom-in" delay={delay}>{children}</AOSWrapper>
);

export const ZoomOut: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="zoom-out" delay={delay}>{children}</AOSWrapper>
);

export const FlipLeft: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="flip-left" delay={delay}>{children}</AOSWrapper>
);

export const FlipRight: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="flip-right" delay={delay}>{children}</AOSWrapper>
);

export const FlipUp: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="flip-up" delay={delay}>{children}</AOSWrapper>
);

export const FlipDown: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <AOSWrapper animation="flip-down" delay={delay}>{children}</AOSWrapper>
);