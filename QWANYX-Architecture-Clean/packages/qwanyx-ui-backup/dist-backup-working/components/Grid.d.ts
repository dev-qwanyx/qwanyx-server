import { default as React } from 'react';
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    columns?: 1 | 2 | 3 | 4 | 5 | 6 | 8 | 12 | 'auto';
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
    responsive?: boolean;
    minChildWidth?: string;
    flow?: 'row' | 'column' | 'dense' | 'row-dense' | 'column-dense';
}
export declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
    start?: number;
    end?: number;
    rowSpan?: number;
    rowStart?: number;
    rowEnd?: number;
    order?: number;
}
export declare const GridItem: React.ForwardRefExoticComponent<GridItemProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Grid.d.ts.map