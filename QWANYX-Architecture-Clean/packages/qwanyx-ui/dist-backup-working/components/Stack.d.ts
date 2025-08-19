import { default as React } from 'react';
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'vertical' | 'horizontal';
    spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    align?: 'start' | 'center' | 'end' | 'stretch';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    divider?: boolean;
    dividerColor?: string;
    wrap?: boolean;
    reverse?: boolean;
    inline?: boolean;
}
export declare const Stack: React.ForwardRefExoticComponent<StackProps & React.RefAttributes<HTMLDivElement>>;
export interface VStackProps extends Omit<StackProps, 'direction'> {
}
export declare const VStack: React.ForwardRefExoticComponent<VStackProps & React.RefAttributes<HTMLDivElement>>;
export interface HStackProps extends Omit<StackProps, 'direction'> {
}
export declare const HStack: React.ForwardRefExoticComponent<HStackProps & React.RefAttributes<HTMLDivElement>>;
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
    inline?: boolean;
    minHeight?: string;
}
export declare const Center: React.ForwardRefExoticComponent<CenterProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Stack.d.ts.map