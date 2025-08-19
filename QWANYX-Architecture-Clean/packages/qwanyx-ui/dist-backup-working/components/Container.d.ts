import { default as React } from 'react';
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    center?: boolean;
}
export declare const Container: React.ForwardRefExoticComponent<ContainerProps & React.RefAttributes<HTMLDivElement>>;
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    fullHeight?: boolean;
}
export declare const Section: React.ForwardRefExoticComponent<SectionProps & React.RefAttributes<HTMLElement>>;
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | number;
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    responsive?: boolean;
    minChildWidth?: string;
}
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
    wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
    gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    fullWidth?: boolean;
    fullHeight?: boolean;
}
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Container.d.ts.map