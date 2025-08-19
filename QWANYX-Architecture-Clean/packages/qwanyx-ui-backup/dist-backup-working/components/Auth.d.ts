import { default as React } from 'react';
export interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode?: 'login' | 'register';
    workspace?: string;
    apiUrl?: string;
    onSuccess?: (user: any, token: string) => void;
}
export declare const AuthModal: React.FC<AuthModalProps>;
export interface AuthStatusProps {
    workspace?: string;
    onLogin?: () => void;
    onLogout?: () => void;
}
export declare const AuthStatus: React.FC<AuthStatusProps>;
//# sourceMappingURL=Auth.d.ts.map