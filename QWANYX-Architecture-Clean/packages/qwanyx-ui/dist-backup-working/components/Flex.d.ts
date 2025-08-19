import { default as React } from 'react';
export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    inline?: boolean;
    flex?: string | number;
}
export declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;
export interface FlexItemProps extends React.HTMLAttributes<HTMLDivElement> {
    grow?: number;
    shrink?: number;
    basis?: string | number;
    order?: number;
    alignSelf?: 'auto' | 'start' | 'end' | 'center' | 'stretch' | 'baseline';
}
export declare const FlexItem: React.ForwardRefExoticComponent<FlexItemProps & React.RefAttributes<HTMLDivElement>>;
export interface SpacerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
    direction?: 'horizontal' | 'vertical' | 'both';
}
export declare const Spacer: React.FC<SpacerProps>;
//# sourceMappingURL=Flex.d.ts.map