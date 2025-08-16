declare module 'qwanyx-modules/NavbarQwanyx' {
  import { FC } from 'react';
  interface NavbarQwanyxProps {
    logo?: string;
    logoAlt?: string;
    workspace?: string;
    links?: Array<{
      label: string;
      href: string;
      active?: boolean;
    }>;
    showAuth?: boolean;
    onAuthClick?: () => void;
    theme?: 'light' | 'dark';
  }
  const NavbarQwanyx: FC<NavbarQwanyxProps>;
  export default NavbarQwanyx;
}

declare module 'qwanyx-modules/HeroGeneric' {
  import { FC } from 'react';
  interface HeroGenericProps {
    title: string;
    subtitle?: string;
    description?: string;
    backgroundImage?: string;
    backgroundColor?: string;
    height?: 'small' | 'medium' | 'large' | 'fullscreen';
    buttons?: Array<{
      label: string;
      variant?: 'primary' | 'secondary' | 'ghost';
      onClick?: () => void;
      href?: string;
    }>;
    centered?: boolean;
    overlay?: boolean;
  }
  const HeroGeneric: FC<HeroGenericProps>;
  export default HeroGeneric;
}

declare module 'qwanyx-modules/ServicesGrid' {
  import { FC } from 'react';
  interface Service {
    icon?: string;
    iconColor?: string;
    title: string;
    description: string;
    link?: {
      label: string;
      href: string;
    };
    action?: {
      label: string;
      onClick: () => void;
    };
  }
  interface ServicesGridProps {
    title?: string;
    subtitle?: string;
    services: Service[];
    columns?: 2 | 3 | 4;
    centered?: boolean;
  }
  const ServicesGrid: FC<ServicesGridProps>;
  export default ServicesGrid;
}

declare module 'qwanyx-modules/FooterGeneric' {
  import { FC } from 'react';
  interface FooterLink {
    label: string;
    href: string;
  }
  interface FooterSection {
    title: string;
    links: FooterLink[];
  }
  interface FooterGenericProps {
    logo?: string;
    logoAlt?: string;
    description?: string;
    sections?: FooterSection[];
    socialLinks?: Array<{
      icon: string;
      href: string;
      label: string;
    }>;
    copyright?: string;
    theme?: 'light' | 'dark';
  }
  const FooterGeneric: FC<FooterGenericProps>;
  export default FooterGeneric;
}

declare module 'qwanyx-modules/hooks/useAuth' {
  export function useAuth(initialToken?: string, workspace?: string): {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkPermission: (role: string) => boolean;
  };
}

declare module 'qwanyx-modules/hooks/useWorkspace' {
  export function useWorkspace(initialWorkspace?: string): {
    workspace: string;
    config: any;
    hasFeature: (feature: string) => boolean;
    setWorkspace: (workspace: string) => void;
  };
}