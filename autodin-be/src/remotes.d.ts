declare module 'qwanyx-modules/NavbarAutodin' {
  import { FC } from 'react';
  
  interface NavbarAutodinProps {
    scrolled?: boolean;
    onDashboardClick?: () => void;
    workspace?: string;
  }
  
  const NavbarAutodin: FC<NavbarAutodinProps>;
  export default NavbarAutodin;
}

declare module 'qwanyx-modules/HeroAutodin' {
  import { FC } from 'react';
  
  interface HeroAutodinProps {}
  
  const HeroAutodin: FC<HeroAutodinProps>;
  export default HeroAutodin;
}

declare module 'qwanyx-modules/ServicesAutodin' {
  import { FC } from 'react';
  
  interface ServicesAutodinProps {
    services?: any[];
    onServiceClick?: (service: any) => void;
  }
  
  const ServicesAutodin: FC<ServicesAutodinProps>;
  export default ServicesAutodin;
}

declare module 'qwanyx-modules/ContactAutodin' {
  import { FC } from 'react';
  
  interface ContactAutodinProps {}
  
  const ContactAutodin: FC<ContactAutodinProps>;
  export default ContactAutodin;
}

declare module 'qwanyx-modules/DashboardAutodin' {
  import { FC } from 'react';
  
  interface DashboardAutodinProps {
    onBack?: () => void;
  }
  
  const DashboardAutodin: FC<DashboardAutodinProps>;
  export default DashboardAutodin;
}

declare module 'qwanyx-modules/AuthModalAutodin' {
  import { FC } from 'react';
  
  interface AuthModalAutodinProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'login' | 'register';
    workspace?: string;
    apiUrl?: string;
    onSuccess?: (user: any, token: string) => void;
  }
  
  const AuthModalAutodin: FC<AuthModalAutodinProps>;
  export default AuthModalAutodin;
}

declare module 'qwanyx-modules/FooterGeneric' {
  import { FC } from 'react';
  
  interface FooterGenericProps {
    theme?: 'light' | 'dark';
    copyright?: string;
    sections?: Array<{
      title: string;
      links: Array<{
        label: string;
        href: string;
      }>;
    }>;
  }
  
  const FooterGeneric: FC<FooterGenericProps>;
  export default FooterGeneric;
}

declare module 'qwanyx-modules/hooks/useAuth' {
  import { FC, ReactNode } from 'react';
  
  export interface User {
    id: string;
    email: string;
    workspace: string;
    metadata?: Record<string, any>;
  }

  export interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    token: string | null;
    workspace: string | null;
    loading: boolean;
  }

  export interface AuthContextType extends AuthState {
    login: (token: string, user: User, rememberMe?: boolean) => void;
    logout: () => void;
    updateUser: (user: User) => void;
    checkAuth: () => Promise<boolean>;
    getAuthHeaders: () => Record<string, string>;
  }

  export const AuthProvider: FC<{ children: ReactNode; workspace?: string; apiUrl?: string; }>;
  export const useAuth: () => AuthContextType;
  export const withAuth: <P extends object>(Component: React.ComponentType<P>, fallback?: React.ComponentType) => FC<P>;
  export const isTokenExpired: (workspace: string) => boolean;
  export const getStoredToken: (workspace: string) => string | null;
  export const getStoredUser: (workspace: string) => User | null;
}