export interface ComponentItem {
  id: string;
  name: string;
  description?: string;
  component?: React.ComponentType;
}

export interface ComponentRegistry {
  [category: string]: ComponentItem[];
}

export const componentRegistry: ComponentRegistry = {
  'Navigation': [
    { id: 'navbar', name: 'Navbar', description: 'Top navigation bar' },
    { id: 'navbar-new', name: 'Navbar (New)', description: 'Enhanced navigation bar' },
    { id: 'navigation-bar', name: 'Navigation Bar', description: 'Flexible navigation component' },
    { id: 'sidebar', name: 'Sidebar', description: 'Vertical navigation sidebar' },
    { id: 'breadcrumb', name: 'Breadcrumb', description: 'Breadcrumb navigation' },
    { id: 'tabs', name: 'Tabs', description: 'Tab navigation component' },
    { id: 'link', name: 'Link', description: 'Navigation links' },
  ],
  'Forms': [
    { id: 'button', name: 'Button', description: 'Interactive button component' },
    { id: 'input', name: 'Input', description: 'Text input field' },
    { id: 'textarea', name: 'Textarea', description: 'Multi-line text input' },
    { id: 'checkbox', name: 'Checkbox', description: 'Checkbox input' },
    { id: 'radio', name: 'Radio', description: 'Radio button input' },
    { id: 'switch', name: 'Switch', description: 'Toggle switch' },
    { id: 'select', name: 'Select', description: 'Dropdown select' },
    { id: 'simple-select', name: 'Simple Select', description: 'Basic select component' },
    { id: 'super-dropdown', name: 'Super Dropdown', description: 'Advanced dropdown with search' },
    { id: 'form', name: 'Form', description: 'Form wrapper with validation' },
    { id: 'otp-input', name: 'OTP Input', description: 'One-time password input' },
  ],
  'Data Display': [
    { id: 'text', name: 'Text', description: 'Typography components' },
    { id: 'heading', name: 'Heading', description: 'Heading typography' },
    { id: 'badge', name: 'Badge', description: 'Status badges' },
    { id: 'card', name: 'Card', description: 'Content card container' },
    { id: 'avatar', name: 'Avatar', description: 'User avatar display' },
    { id: 'progress', name: 'Progress', description: 'Progress indicators' },
    { id: 'spinner', name: 'Spinner', description: 'Loading spinner' },
    { id: 'tooltip', name: 'Tooltip', description: 'Hover tooltips' },
    { id: 'icon', name: 'Icon', description: 'Icon component' },
  ],
  'Feedback': [
    { id: 'alert', name: 'Alert', description: 'Alert messages' },
    { id: 'modal', name: 'Modal', description: 'Modal dialogs' },
    { id: 'auth-modal', name: 'Auth Modal', description: 'Authentication modal' },
  ],
  'Layout': [
    { id: 'container', name: 'Container', description: 'Content container' },
    { id: 'section', name: 'Section', description: 'Page sections' },
    { id: 'grid', name: 'Grid', description: 'Grid layout' },
    { id: 'flex', name: 'Flex', description: 'Flexbox layout' },
    { id: 'stack', name: 'Stack', description: 'Stacked layout' },
    { id: 'masonry', name: 'Masonry', description: 'Masonry grid layout' },
    { id: 'dashboard-layout', name: 'Dashboard Layout', description: 'Dashboard page layout' },
    { id: 'collapsible', name: 'Collapsible', description: 'Collapsible content' },
  ],
  'Marketing': [
    { id: 'hero', name: 'Hero', description: 'Hero section' },
    { id: 'feature', name: 'Feature', description: 'Feature showcase' },
    { id: 'footer', name: 'Footer', description: 'Page footer' },
    { id: 'service-card', name: 'Service Card', description: 'Service display card' },
    { id: 'double-flip', name: 'Double Flip', description: 'Flip animation card' },
  ],
  'Animation': [
    { id: 'animated', name: 'Animated', description: 'Animation wrapper' },
    { id: 'parallax', name: 'Parallax', description: 'Parallax scrolling effects' },
  ],
  'Theme': [
    { id: 'theme-toggle', name: 'Theme Toggle', description: 'Dark/light mode toggle' },
    { id: 'favicon', name: 'Favicon', description: 'Dynamic favicon' },
  ],
  'Business': [
    { id: 'agile-status', name: 'Agile Status', description: 'Agile/Scrum status indicators' },
    { id: 'user-profile', name: 'User Profile', description: 'User profile display' },
  ],
};