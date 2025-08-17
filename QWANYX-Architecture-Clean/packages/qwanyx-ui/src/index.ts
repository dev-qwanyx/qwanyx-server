// Import styles
import './styles.css';

// Theme Provider
export { ThemeProvider, useTheme } from './providers/ThemeProvider';
export type { Theme } from './providers/ThemeProvider';

// Theme Mode Hook
export { useThemeMode, getStoredThemeMode, getResolvedTheme } from './hooks/useThemeMode';
export type { ThemeMode } from './hooks/useThemeMode';

// Theme Toggle Component
export { ThemeToggle } from './components/ThemeToggle';
export type { ThemeToggleProps } from './components/ThemeToggle';

// Workspace Provider
export { WorkspaceProvider, useWorkspace } from './providers/WorkspaceProvider';
export type { WorkspaceProviderProps } from './providers/WorkspaceProvider';

// Components
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';

export { Link, NavLink } from './components/Link';
export type { LinkProps, NavLinkProps } from './components/Link';

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardImage
} from './components/Card';
export type { 
  CardProps, 
  CardHeaderProps, 
  CardTitleProps, 
  CardDescriptionProps, 
  CardContentProps, 
  CardFooterProps,
  CardImageProps
} from './components/Card';

export { ServiceCard } from './components/ServiceCard';
export type { ServiceCardProps } from './components/ServiceCard';

export { DoubleFlip } from './components/DoubleFlip';
export type { DoubleFlipProps } from './components/DoubleFlip';

export { Input, Textarea } from './components/Input';
export type { InputProps, TextareaProps } from './components/Input';

export { Heading, Text, Code } from './components/Text';
export type { HeadingProps, TextProps, CodeProps } from './components/Text';

export { Container, Section } from './components/Container';
export type { ContainerProps, SectionProps } from './components/Container';

// Layout Components
export { Grid, GridItem } from './components/Grid';
export type { GridProps, GridItemProps } from './components/Grid';

export { Flex, FlexItem, Spacer } from './components/Flex';
export type { FlexProps, FlexItemProps, SpacerProps } from './components/Flex';

export { Stack, VStack, HStack, Center } from './components/Stack';
export type { StackProps, VStackProps, HStackProps, CenterProps } from './components/Stack';

export { Masonry, AdvancedMasonry } from './components/Masonry';
export type { MasonryProps, AdvancedMasonryProps } from './components/Masonry';

export { 
  HolyGrailLayout, 
  MagazineLayout, 
  SplitLayout, 
  BentoLayout, 
  AsymmetricLayout 
} from './components/Layouts';
export type { 
  HolyGrailLayoutProps, 
  MagazineLayoutProps, 
  SplitLayoutProps, 
  BentoLayoutProps, 
  AsymmetricLayoutProps 
} from './components/Layouts';

export { 
  Navbar,
  NavbarBrand,
  NavbarLogo,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  SimpleNavbar 
} from './components/Navbar';
export type { 
  NavbarProps,
  NavbarBrandProps,
  NavbarLogoProps,
  NavbarContentProps,
  NavbarItemProps,
  NavbarMenuProps,
  SimpleNavbarProps 
} from './components/Navbar';

export {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  SimpleTabs
} from './components/Tabs';
export type {
  TabsProps,
  TabsListProps,
  TabsTriggerProps,
  TabsContentProps,
  SimpleTabsProps
} from './components/Tabs';

export {
  Hero,
  HeroTitle,
  HeroSubtitle,
  HeroContent,
  HeroActions
} from './components/Hero';
export type {
  HeroProps,
  HeroTitleProps,
  HeroSubtitleProps,
  HeroContentProps,
  HeroActionsProps
} from './components/Hero';

export {
  Feature,
  FeatureIcon,
  FeatureTitle,
  FeatureDescription,
  FeaturesGrid
} from './components/Feature';
export type {
  FeatureProps,
  FeatureIconProps,
  FeatureTitleProps,
  FeatureDescriptionProps,
  FeaturesGridProps
} from './components/Feature';

export {
  Footer,
  FooterSection,
  FooterTitle,
  FooterLink,
  FooterLinks,
  FooterGrid,
  FooterBottom
} from './components/Footer';
export type {
  FooterProps,
  FooterSectionProps,
  FooterTitleProps,
  FooterLinkProps,
  FooterLinksProps,
  FooterGridProps,
  FooterBottomProps
} from './components/Footer';

export {
  Badge,
  IconBadge,
  ClosableBadge,
  DotBadge
} from './components/Badge';
export type {
  BadgeProps,
  IconBadgeProps,
  ClosableBadgeProps,
  DotBadgeProps
} from './components/Badge';

export {
  Avatar,
  AvatarGroup,
  InitialsAvatar
} from './components/Avatar';
export type {
  AvatarProps,
  AvatarGroupProps,
  InitialsAvatarProps
} from './components/Avatar';

export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  SimpleModal
} from './components/Modal';
export type {
  ModalProps,
  ModalHeaderProps,
  ModalTitleProps,
  ModalDescriptionProps,
  ModalBodyProps,
  ModalFooterProps,
  SimpleModalProps
} from './components/Modal';

export { Alert } from './components/Alert';
export type { AlertProps } from './components/Alert';

export { Sidebar, SimpleSidebar } from './components/Sidebar';
export type { SidebarProps, SimpleSidebarProps, SidebarItem } from './components/Sidebar';

export { DashboardLayout, SimpleDashboardLayout } from './components/DashboardLayout';
export type { DashboardLayoutProps, SimpleDashboardLayoutProps } from './components/DashboardLayout';

// Icons - Using Google Material Symbols
export { Icon, Icons } from './components/Icon';
export type { IconProps } from './components/Icon';

// Spinner
export { Spinner, SpinnerWithText } from './components/Spinner';
export type { SpinnerProps, SpinnerWithTextProps } from './components/Spinner';

// Switch
export { Switch, SwitchGroup } from './components/Switch';
export type { SwitchProps, SwitchGroupProps } from './components/Switch';

// Checkbox (new improved version)
export { Checkbox as CheckboxNew, CheckboxGroup } from './components/Checkbox';
export type { CheckboxProps as CheckboxNewProps, CheckboxGroupProps } from './components/Checkbox';

// Radio (new improved version)
export { Radio as RadioNew, RadioGroup } from './components/Radio';
export type { RadioProps as RadioNewProps, RadioGroupProps } from './components/Radio';

// Progress
export { Progress, ProgressWithLabel } from './components/Progress';
export type { ProgressProps, ProgressWithLabelProps } from './components/Progress';

// Agile Status (Molecules using Progress)
export { AgileStatusIcon, AgileStatusBadge, AgileTaskCard } from './components/AgileStatus';
export type { AgileStatus, AgileStatusIconProps, AgileStatusBadgeProps, AgileTaskCardProps } from './components/AgileStatus';

export { AuthModal, AuthStatus } from './components/Auth';
export type { AuthModalProps, AuthStatusProps } from './components/Auth';

export { OTPInput, OTPTimer } from './components/OTPInput';
export type { OTPInputProps, OTPTimerProps } from './components/OTPInput';

export { Favicon, useFavicon } from './components/Favicon';
export type { FaviconProps } from './components/Favicon';

export { Animated, AnimateOnScroll, AnimateOnHover, AnimateOnClick } from './components/Animated';
export type { AnimatedProps } from './components/Animated';

export { 
  Parallax, 
  ParallaxImage, 
  ParallaxText, 
  ParallaxLayer, 
  ParallaxSection,
  ParallaxReveal 
} from './components/Parallax';
export type { 
  ParallaxProps, 
  ParallaxImageProps, 
  ParallaxTextProps, 
  ParallaxLayerProps, 
  ParallaxSectionProps,
  ParallaxRevealProps 
} from './components/Parallax';

export { 
  Form, 
  Field, 
  Control, 
  Select, 
  Checkbox, 
  Radio, 
  FileInput,
  useFormContext,
  useForm
} from './components/Form';
export type { 
  FormProps, 
  FieldProps, 
  ControlProps, 
  SelectProps, 
  SelectOption,
  CheckboxProps, 
  RadioProps, 
  FileInputProps,
  FieldValues,
  UseFormReturn,
  SubmitHandler
} from './components/Form';

// SuperDropdown - The ultimate dropdown component
export { 
  SuperDropdown,
  MultiSelect,
  Combobox,
  CommandPalette
} from './components/SuperDropdown';
export type { 
  SuperDropdownProps,
  DropdownOption
} from './components/SuperDropdown';

// Special Components

// Page Components
export {
  Page,
  PageHeader,
  PageContent,
  PageFooter,
  PageSection
} from './components/Page';
export type {
  PageProps,
  PageHeaderProps,
  PageContentProps,
  PageFooterProps,
  PageSectionProps,
  NavigationItem
} from './components/Page';

// Preconfigured Pages
export { LandingPage } from './pages/LandingPage';
export type { LandingPageProps } from './pages/LandingPage';

export { DashboardPage } from './pages/DashboardPage';
export type { DashboardPageProps } from './pages/DashboardPage';

export { MarketplacePage } from './pages/MarketplacePage';
export type { MarketplacePageProps, MarketplaceItem } from './pages/MarketplacePage';

// Preconfigured Sections
export { HeroSection } from './sections/HeroSection';
export type { HeroSectionProps } from './sections/HeroSection';

export { FeaturesSection } from './sections/FeaturesSection';
export type { FeaturesSectionProps, FeatureItem } from './sections/FeaturesSection';

export { CTASection } from './sections/CTASection';
export type { CTASectionProps } from './sections/CTASection';

export { TestimonialsSection } from './sections/TestimonialsSection';
export type { TestimonialsSectionProps, Testimonial } from './sections/TestimonialsSection';

export { PricingSection } from './sections/PricingSection';
export type { PricingSectionProps, PricingPlan } from './sections/PricingSection';

export { HeroWithFlipSection } from './sections/HeroWithFlipSection';
export type { HeroWithFlipSectionProps } from './sections/HeroWithFlipSection';
export { SimpleFooterSection } from './sections/SimpleFooterSection';
export type { SimpleFooterSectionProps } from './sections/SimpleFooterSection';

export { 
  ContactFormSection, 
  simpleContactFields, 
  detailedContactFields, 
  businessContactFields 
} from './sections/ContactFormSection';
export type { ContactFormSectionProps, ContactFormField } from './sections/ContactFormSection';

// Templates
export { QwanyxTemplate } from './templates/QwanyxTemplate';
export type { QwanyxTemplateProps } from './templates/QwanyxTemplate';