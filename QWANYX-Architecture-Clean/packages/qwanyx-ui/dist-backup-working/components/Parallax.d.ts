import { default as React } from 'react';
export interface ParallaxProps {
    children: React.ReactNode;
    speed?: number;
    offset?: number;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Parallax: React.FC<ParallaxProps>;
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
export declare const ParallaxImage: React.FC<ParallaxImageProps>;
export interface ParallaxTextProps {
    children: React.ReactNode;
    speed?: number;
    className?: string;
    direction?: 'up' | 'down' | 'left' | 'right';
}
export declare const ParallaxText: React.FC<ParallaxTextProps>;
export interface ParallaxLayerProps {
    children: React.ReactNode;
    depth?: number;
    className?: string;
}
export declare const ParallaxLayer: React.FC<ParallaxLayerProps>;
export interface ParallaxSectionProps {
    children: React.ReactNode;
    backgroundImage?: string;
    height?: string;
    className?: string;
    overlayOpacity?: number;
}
export declare const ParallaxSection: React.FC<ParallaxSectionProps>;
export interface ParallaxRevealProps {
    children: React.ReactNode;
    className?: string;
    animation?: 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'zoom' | 'rotate';
    delay?: number;
}
export declare const ParallaxReveal: React.FC<ParallaxRevealProps>;
//# sourceMappingURL=Parallax.d.ts.map