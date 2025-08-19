import { default as React } from 'react';
export interface AnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: 'bounce' | 'flash' | 'pulse' | 'rubberBand' | 'shakeX' | 'shakeY' | 'headShake' | 'swing' | 'tada' | 'wobble' | 'jello' | 'heartBeat' | 'backInDown' | 'backInLeft' | 'backInRight' | 'backInUp' | 'backOutDown' | 'backOutLeft' | 'backOutRight' | 'backOutUp' | 'bounceIn' | 'bounceInDown' | 'bounceInLeft' | 'bounceInRight' | 'bounceInUp' | 'bounceOut' | 'bounceOutDown' | 'bounceOutLeft' | 'bounceOutRight' | 'bounceOutUp' | 'fadeIn' | 'fadeInDown' | 'fadeInDownBig' | 'fadeInLeft' | 'fadeInLeftBig' | 'fadeInRight' | 'fadeInRightBig' | 'fadeInUp' | 'fadeInUpBig' | 'fadeInTopLeft' | 'fadeInTopRight' | 'fadeInBottomLeft' | 'fadeInBottomRight' | 'fadeOut' | 'fadeOutDown' | 'fadeOutDownBig' | 'fadeOutLeft' | 'fadeOutLeftBig' | 'fadeOutRight' | 'fadeOutRightBig' | 'fadeOutUp' | 'fadeOutUpBig' | 'fadeOutTopLeft' | 'fadeOutTopRight' | 'fadeOutBottomLeft' | 'fadeOutBottomRight' | 'flip' | 'flipInX' | 'flipInY' | 'flipOutX' | 'flipOutY' | 'lightSpeedInRight' | 'lightSpeedInLeft' | 'lightSpeedOutRight' | 'lightSpeedOutLeft' | 'rotateIn' | 'rotateInDownLeft' | 'rotateInDownRight' | 'rotateInUpLeft' | 'rotateInUpRight' | 'rotateOut' | 'rotateOutDownLeft' | 'rotateOutDownRight' | 'rotateOutUpLeft' | 'rotateOutUpRight' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'slideInUp' | 'slideOutDown' | 'slideOutLeft' | 'slideOutRight' | 'slideOutUp' | 'zoomIn' | 'zoomInDown' | 'zoomInLeft' | 'zoomInRight' | 'zoomInUp' | 'zoomOut' | 'zoomOutDown' | 'zoomOutLeft' | 'zoomOutRight' | 'zoomOutUp' | 'hinge' | 'jackInTheBox' | 'rollIn' | 'rollOut';
    duration?: 'faster' | 'fast' | 'slow' | 'slower' | number;
    delay?: 'delay-1s' | 'delay-2s' | 'delay-3s' | 'delay-4s' | 'delay-5s' | number;
    repeat?: 'repeat-1' | 'repeat-2' | 'repeat-3' | 'infinite';
    triggerOnScroll?: boolean;
    triggerOnHover?: boolean;
    triggerOnClick?: boolean;
    as?: keyof React.JSX.IntrinsicElements;
}
export declare const Animated: React.ForwardRefExoticComponent<AnimatedProps & React.RefAttributes<HTMLDivElement>>;
export declare const AnimateOnScroll: React.FC<AnimatedProps>;
export declare const AnimateOnHover: React.FC<AnimatedProps>;
export declare const AnimateOnClick: React.FC<AnimatedProps>;
//# sourceMappingURL=Animated.d.ts.map