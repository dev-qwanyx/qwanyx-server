import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Common animation variants
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  }
};

export const slideInLeftVariants: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export const slideInRightVariants: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export const slideInUpVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

export const scaleInVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { 
    scale: 1, 
    opacity: 1,
    transition: { type: "spring", stiffness: 200 }
  }
};

export const rotateInVariants: Variants = {
  hidden: { rotate: -180, opacity: 0 },
  visible: { 
    rotate: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Stagger children animation
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 }
  }
};

// Motion Components
export const MotionDiv = motion.div;
export const MotionSection = motion.section;
export const MotionArticle = motion.article;
export const MotionButton = motion.button;
export const MotionSpan = motion.span;
export const MotionH1 = motion.h1;
export const MotionH2 = motion.h2;
export const MotionP = motion.p;
export const MotionLi = motion.li;

// AnimatePresence for exit animations
export { AnimatePresence };

// Animated wrapper component
interface AnimatedProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'scaleIn' | 'rotateIn';
  delay?: number;
  duration?: number;
  className?: string;
  whileHover?: any;
  whileTap?: any;
  custom?: Variants;
}

export const Animated: React.FC<AnimatedProps> = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.5,
  className = '',
  whileHover,
  whileTap,
  custom
}) => {
  const animationMap = {
    fadeIn: fadeInVariants,
    slideInLeft: slideInLeftVariants,
    slideInRight: slideInRightVariants,
    slideInUp: slideInUpVariants,
    scaleIn: scaleInVariants,
    rotateIn: rotateInVariants
  };

  const variants = custom || animationMap[animation];

  return (
    <MotionDiv
      className={className}
      initial="hidden"
      animate="visible"
      variants={variants}
      whileHover={whileHover}
      whileTap={whileTap}
      transition={{ delay, duration }}
    >
      {children}
    </MotionDiv>
  );
};

// Page transition wrapper
interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className }) => {
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {children}
    </MotionDiv>
  );
};

// Parallax scroll effect
interface ParallaxProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
}

export const Parallax: React.FC<ParallaxProps> = ({ 
  children, 
  offset = 50,
  className = ''
}) => {
  return (
    <MotionDiv
      className={className}
      initial={{ y: -offset }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
      whileInView={{ y: 0 }}
      viewport={{ once: false, amount: 0.3 }}
    >
      {children}
    </MotionDiv>
  );
};

// Hover effects
export const hoverScale = { scale: 1.05 };
export const hoverRotate = { rotate: 5 };
export const hoverLift = { y: -5 };
export const tapScale = { scale: 0.95 };

// Scroll reveal wrapper
interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'scaleIn';
  className?: string;
  threshold?: number;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeIn',
  className = '',
  threshold = 0.3
}) => {
  const animationMap = {
    fadeIn: fadeInVariants,
    slideInLeft: slideInLeftVariants,
    slideInRight: slideInRightVariants,
    slideInUp: slideInUpVariants,
    scaleIn: scaleInVariants
  };

  return (
    <MotionDiv
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={animationMap[animation]}
    >
      {children}
    </MotionDiv>
  );
};