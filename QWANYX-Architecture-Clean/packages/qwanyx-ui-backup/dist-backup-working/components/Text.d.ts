import { default as React } from 'react';
export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: '5xl' | '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'md' | 'base' | 'sm' | 'xs';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
    color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    align?: 'left' | 'center' | 'right' | 'justify';
}
export declare const Heading: React.ForwardRefExoticComponent<HeadingProps & React.RefAttributes<HTMLHeadingElement>>;
export interface TextProps {
    children?: React.ReactNode;
    as?: 'p' | 'span' | 'div' | 'label';
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
    weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'success' | 'warning' | 'error' | 'info';
    align?: 'left' | 'center' | 'right' | 'justify';
    italic?: boolean;
    underline?: boolean;
    lineThrough?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
export declare const Text: React.ForwardRefExoticComponent<TextProps & React.RefAttributes<HTMLParagraphElement>>;
export interface CodeProps extends React.HTMLAttributes<HTMLElement> {
    variant?: 'inline' | 'block';
    language?: string;
}
export declare const Code: React.ForwardRefExoticComponent<CodeProps & React.RefAttributes<HTMLElement>>;
//# sourceMappingURL=Text.d.ts.map