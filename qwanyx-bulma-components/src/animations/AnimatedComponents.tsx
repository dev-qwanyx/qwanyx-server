import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Button, ButtonProps } from '../components/Button';
import { Card, CardProps } from '../components/Card';
import { Box, BoxProps } from '../components/Box';
import { Notification, NotificationProps } from '../components/Notification';

// Animated Button Component
interface AnimatedButtonProps extends ButtonProps {
  whileHover?: any;
  whileTap?: any;
  animate?: boolean;
  animationType?: 'pulse' | 'glow' | 'lift' | 'scale';
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  whileHover,
  whileTap,
  animate = true,
  animationType = 'scale',
  ...props
}) => {
  const defaultAnimations = {
    pulse: {
      whileHover: { scale: [1, 1.05, 1] },
      transition: { repeat: Infinity, duration: 1 }
    },
    glow: {
      whileHover: { 
        boxShadow: "0px 0px 20px rgba(0, 209, 178, 0.6)",
        transition: { duration: 0.3 }
      }
    },
    lift: {
      whileHover: { 
        y: -5,
        boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
        transition: { type: "spring", stiffness: 300 }
      }
    },
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 }
    }
  };

  const selectedAnimation = animate ? defaultAnimations[animationType] : {};

  return (
    <motion.div
      whileHover={whileHover || selectedAnimation.whileHover}
      whileTap={whileTap || selectedAnimation.whileTap || { scale: 0.98 }}
      transition={selectedAnimation.transition}
      style={{ display: 'inline-block' }}
    >
      <Button {...props}>{children}</Button>
    </motion.div>
  );
};

// Animated Card Component
interface AnimatedCardProps extends CardProps {
  animateOnHover?: boolean;
  animateOnScroll?: boolean;
  hoverEffect?: 'lift' | 'scale' | 'rotate' | 'glow';
  scrollAnimation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  animateOnHover = true,
  animateOnScroll = false,
  hoverEffect = 'lift',
  scrollAnimation = 'fadeIn',
  delay = 0,
  ...props
}) => {
  const hoverEffects = {
    lift: { y: -10, boxShadow: "0px 20px 30px rgba(0, 0, 0, 0.15)" },
    scale: { scale: 1.03 },
    rotate: { rotate: 2 },
    glow: { boxShadow: "0px 0px 30px rgba(0, 209, 178, 0.4)" }
  };

  const scrollAnimations: { [key: string]: Variants } = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    },
    slideUp: {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1 }
    },
    slideLeft: {
      hidden: { x: -50, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    slideRight: {
      hidden: { x: 50, opacity: 0 },
      visible: { x: 0, opacity: 1 }
    },
    scale: {
      hidden: { scale: 0.8, opacity: 0 },
      visible: { scale: 1, opacity: 1 }
    }
  };

  const motionProps: any = {};

  if (animateOnHover) {
    motionProps.whileHover = hoverEffects[hoverEffect];
  }

  if (animateOnScroll) {
    motionProps.initial = "hidden";
    motionProps.whileInView = "visible";
    motionProps.viewport = { once: true, amount: 0.3 };
    motionProps.variants = scrollAnimations[scrollAnimation];
  }

  return (
    <motion.div
      {...motionProps}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20,
        delay
      }}
    >
      <Card {...props}>{children}</Card>
    </motion.div>
  );
};

// Animated Box Component
interface AnimatedBoxProps extends BoxProps {
  animateOnHover?: boolean;
  animateOnScroll?: boolean;
  animation?: 'fadeIn' | 'slideUp' | 'scale' | 'blur';
}

export const AnimatedBox: React.FC<AnimatedBoxProps> = ({
  children,
  animateOnHover = false,
  animateOnScroll = true,
  animation = 'fadeIn',
  ...props
}) => {
  const animations: { [key: string]: Variants } = {
    fadeIn: {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { duration: 0.6 } }
    },
    slideUp: {
      hidden: { y: 30, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
    },
    scale: {
      hidden: { scale: 0.9, opacity: 0 },
      visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 150 } }
    },
    blur: {
      hidden: { filter: "blur(10px)", opacity: 0 },
      visible: { filter: "blur(0px)", opacity: 1, transition: { duration: 0.8 } }
    }
  };

  return (
    <motion.div
      initial={animateOnScroll ? "hidden" : undefined}
      whileInView={animateOnScroll ? "visible" : undefined}
      viewport={animateOnScroll ? { once: true, amount: 0.3 } : undefined}
      variants={animations[animation]}
      whileHover={animateOnHover ? { scale: 1.02 } : undefined}
      transition={{ type: "spring", stiffness: 200 }}
    >
      <Box {...props}>{children}</Box>
    </motion.div>
  );
};

// Animated Notification Component
interface AnimatedNotificationProps extends NotificationProps {
  animateIn?: boolean;
  animationType?: 'slide' | 'fade' | 'bounce';
}

export const AnimatedNotification: React.FC<AnimatedNotificationProps> = ({
  children,
  animateIn = true,
  animationType = 'slide',
  ...props
}) => {
  const animations = {
    slide: {
      initial: { x: 300, opacity: 0 },
      animate: { x: 0, opacity: 1 },
      exit: { x: 300, opacity: 0 }
    },
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    bounce: {
      initial: { y: -100, opacity: 0 },
      animate: { 
        y: 0, 
        opacity: 1,
        transition: {
          type: "spring",
          damping: 25,
          stiffness: 500
        }
      },
      exit: { y: -100, opacity: 0 }
    }
  };

  const selectedAnimation = animations[animationType];

  if (!animateIn) {
    return <Notification {...props}>{children}</Notification>;
  }

  return (
    <motion.div
      initial={selectedAnimation.initial}
      animate={selectedAnimation.animate}
      exit={selectedAnimation.exit}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      <Notification {...props}>{children}</Notification>
    </motion.div>
  );
};

// Stagger Container for animating lists
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className = '',
  staggerDelay = 0.1
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
};

// Stagger Item for use inside StaggerContainer
interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = '' }) => {
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
};

// Floating animation component
interface FloatingProps {
  children: React.ReactNode;
  duration?: number;
  distance?: number;
}

export const Floating: React.FC<FloatingProps> = ({ 
  children, 
  duration = 3,
  distance = 20
}) => {
  return (
    <motion.div
      animate={{ 
        y: [0, -distance, 0]
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {children}
    </motion.div>
  );
};

// Shake animation component
interface ShakeProps {
  children: React.ReactNode;
  onHover?: boolean;
  onClick?: boolean;
}

export const Shake: React.FC<ShakeProps> = ({ 
  children, 
  onHover = false,
  onClick = false
}) => {
  const shakeAnimation = {
    x: [-5, 5, -5, 5, 0],
    transition: { duration: 0.5 }
  };

  return (
    <motion.div
      whileHover={onHover ? shakeAnimation : undefined}
      whileTap={onClick ? shakeAnimation : undefined}
    >
      {children}
    </motion.div>
  );
};