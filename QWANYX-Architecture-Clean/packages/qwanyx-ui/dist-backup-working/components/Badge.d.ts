import { default as React } from 'react';
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'solid' | 'outline' | 'subtle';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'gray';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    rounded?: 'sm' | 'md' | 'lg' | 'full';
}
export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLSpanElement>>;
export interface IconBadgeProps extends BadgeProps {
    icon?: React.ReactNode;
    iconPosition?: 'left' | 'right';
}
export declare const IconBadge: React.ForwardRefExoticComponent<IconBadgeProps & React.RefAttributes<HTMLSpanElement>>;
export interface ClosableBadgeProps extends BadgeProps {
    onClose?: () => void;
}
export declare const ClosableBadge: React.ForwardRefExoticComponent<ClosableBadgeProps & React.RefAttributes<HTMLSpanElement>>;
export interface DotBadgeProps extends BadgeProps {
    dot?: boolean;
    dotPosition?: 'left' | 'right';
    dotColor?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}
export declare const DotBadge: React.ForwardRefExoticComponent<DotBadgeProps & React.RefAttributes<HTMLSpanElement>>;
//# sourceMappingURL=Badge.d.ts.map