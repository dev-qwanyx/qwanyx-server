import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

export interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  offset?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const Parallax: React.FC<ParallaxProps> = ({
  children,
  speed = 0.5,
  offset = 0,
  className = '',
  style = {}
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset * speed]);
  const springY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      ref={ref}
      style={{ ...style, y: springY }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export interface ParallaxImageProps {
  src: string;
  alt?: string;
  speed?: number;
  scale?: boolean;
  className?: string;
  containerClassName?: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const ParallaxImage: React.FC<ParallaxImageProps> = ({
  src,
  alt = '',
  speed = 0.5,
  scale = true,
  className = '',
  containerClassName = '',
  overlay = false,
  overlayOpacity = 0.5
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ['20%', '-20%']);
  const scaleValue = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.2]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${containerClassName}`} style={{ position: 'relative', minHeight: '100px' }}>
      <motion.div
        style={{
          y: speed !== 0 ? y : 0,
          scale: scale ? scaleValue : 1,
          position: 'absolute',
          top: '-10%',
          left: 0,
          right: 0,
          bottom: '-10%',
          width: '100%',
          height: '120%'
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${className}`}
          style={{ display: 'block' }}
        />
        {overlay && (
          <div 
            className="absolute inset-0 bg-black" 
            style={{ opacity: overlayOpacity }}
          />
        )}
      </motion.div>
    </div>
  );
};

export interface ParallaxTextProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

export const ParallaxText: React.FC<ParallaxTextProps> = ({
  children,
  speed = 0.5,
  className = '',
  direction = 'up'
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const getTransform = (): MotionValue<string> => {
    const distance = 100 * speed;
    switch (direction) {
      case 'up':
        return useTransform(scrollYProgress, [0, 1], [`${distance}px`, `-${distance}px`]);
      case 'down':
        return useTransform(scrollYProgress, [0, 1], [`-${distance}px`, `${distance}px`]);
      case 'left':
        return useTransform(scrollYProgress, [0, 1], [`${distance}px`, `-${distance}px`]);
      case 'right':
        return useTransform(scrollYProgress, [0, 1], [`-${distance}px`, `${distance}px`]);
    }
  };

  const transform = getTransform();
  const springTransform = useSpring(transform, { stiffness: 100, damping: 30 });

  const motionStyle = direction === 'left' || direction === 'right'
    ? { x: springTransform }
    : { y: springTransform };

  return (
    <motion.div
      ref={ref}
      style={motionStyle}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export interface ParallaxLayerProps {
  children: React.ReactNode;
  depth?: number; // 0 = foreground, 1 = background
  className?: string;
}

export const ParallaxLayer: React.FC<ParallaxLayerProps> = ({
  children,
  depth = 0.5,
  className = ''
}) => {
  const speed = depth * 0.5;
  return (
    <Parallax speed={speed} className={className}>
      {children}
    </Parallax>
  );
};

export interface ParallaxSectionProps {
  children: React.ReactNode;
  backgroundImage?: string;
  height?: string;
  className?: string;
  overlayOpacity?: number;
}

export const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  backgroundImage,
  height = '100vh',
  className = '',
  overlayOpacity = 0.3
}) => {
  return (
    <div className={`relative overflow-hidden ${className}`} style={{ height }}>
      {backgroundImage && (
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src={backgroundImage}
            containerClassName="w-full h-full"
            overlay={true}
            overlayOpacity={overlayOpacity}
            speed={0.3}
          />
        </div>
      )}
      <div className="relative z-10 h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

// Reveal animations on scroll
export interface ParallaxRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'zoom' | 'rotate';
  delay?: number;
}

export const ParallaxReveal: React.FC<ParallaxRevealProps> = ({
  children,
  className = '',
  animation = 'fadeUp',
  delay = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationVariants = () => {
    switch (animation) {
      case 'fadeUp':
        return {
          hidden: { opacity: 0, y: 50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fadeDown':
        return {
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 }
        };
      case 'fadeLeft':
        return {
          hidden: { opacity: 0, x: 50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'fadeRight':
        return {
          hidden: { opacity: 0, x: -50 },
          visible: { opacity: 1, x: 0 }
        };
      case 'zoom':
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: { opacity: 1, scale: 1 }
        };
      case 'rotate':
        return {
          hidden: { opacity: 0, rotate: -10 },
          visible: { opacity: 1, rotate: 0 }
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={getAnimationVariants()}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
};