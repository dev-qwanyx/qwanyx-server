import { default as React } from 'react';
export interface DoubleFlipProps {
    images: string[];
    flipDelay?: {
        min: number;
        max: number;
    };
    flipDuration?: number;
    onImageClick?: (image: string, side: 'left' | 'right') => void;
    size?: string | {
        mobile: string;
        tablet: string;
        desktop: string;
    };
    gap?: string;
    className?: string;
}
export declare const DoubleFlip: React.FC<DoubleFlipProps>;
export default DoubleFlip;
//# sourceMappingURL=DoubleFlip.d.ts.map