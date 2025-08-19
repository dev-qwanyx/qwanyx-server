import { default as React } from 'react';
export interface UserProfileProps {
    user: {
        name: string;
        email?: string;
        avatar?: string;
        role?: string;
    };
    size?: 'sm' | 'md' | 'lg';
    showEmail?: boolean;
    showRole?: boolean;
    showName?: boolean;
    orientation?: 'horizontal' | 'vertical';
    className?: string;
    style?: React.CSSProperties;
    onClick?: () => void;
}
export declare const UserProfile: React.FC<UserProfileProps>;
//# sourceMappingURL=UserProfile.d.ts.map