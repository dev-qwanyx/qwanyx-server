import { default as React } from 'react';
export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
    name?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    shape?: 'circle' | 'square';
    fallback?: string | React.ReactNode;
    status?: 'online' | 'offline' | 'away' | 'busy';
    statusPosition?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}
export declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLDivElement>>;
export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    max?: number;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    spacing?: 'tight' | 'normal' | 'loose';
}
export declare const AvatarGroup: React.ForwardRefExoticComponent<AvatarGroupProps & React.RefAttributes<HTMLDivElement>>;
export interface InitialsAvatarProps extends Omit<AvatarProps, 'fallback' | 'name'> {
    name: string;
    color?: 'auto' | 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info';
}
export declare const InitialsAvatar: React.ForwardRefExoticComponent<InitialsAvatarProps & React.RefAttributes<HTMLDivElement>>;
//# sourceMappingURL=Avatar.d.ts.map