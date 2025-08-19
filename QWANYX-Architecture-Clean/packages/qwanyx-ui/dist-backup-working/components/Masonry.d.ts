import { default as React } from 'react';
export interface MasonryProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: number | 'auto';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    breakpoints?: {
        [key: number]: number;
    };
}
export declare const Masonry: React.ForwardRefExoticComponent<MasonryProps & React.RefAttributes<HTMLDivElement>>;
export interface AdvancedMasonryProps extends MasonryProps {
    itemSelector?: string;
    animate?: boolean;
}
export declare const AdvancedMasonry: React.ForwardRefExoticComponent<AdvancedMasonryProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Masonry.d.ts.map