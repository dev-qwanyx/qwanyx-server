import React, { useState, useEffect } from 'react';
import { Link } from './Link';
import { Button } from './Button';
import { Text } from './Text';
import { Avatar } from './Avatar';
import { Icon } from './Icon';

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  icon?: React.ReactNode;
  badge?: string | number;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface SidebarProps {
  items: SidebarItem[];
  logo?: React.ReactNode;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  footer?: React.ReactNode;
  collapsed?: boolean;
  collapsible?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  className?: string;
  width?: string;
  collapsedWidth?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  logo,
  user,
  footer,
  collapsed: controlledCollapsed,
  collapsible = true,
  onCollapse,
  className = '',
  width = '280px',
  collapsedWidth = '80px'
}) => {
  const [isCollapsed, setIsCollapsed] = useState(controlledCollapsed ?? false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const collapsed = controlledCollapsed !== undefined ? controlledCollapsed : isCollapsed;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCollapse = () => {
    const newCollapsed = !collapsed;
    setIsCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const renderItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    
    return (
      <div key={item.id} className="qwanyx-sidebar__item-wrapper">
        {item.href ? (
          <Link
            href={item.href}
            className={`qwanyx-sidebar__item qwanyx-sidebar__item--level-${level}`}
          >
            {item.icon && (
              <span className="qwanyx-sidebar__item-icon">{item.icon}</span>
            )}
            {!collapsed && (
              <>
                <span className="qwanyx-sidebar__item-label">{item.label}</span>
                {item.badge && (
                  <span className="qwanyx-sidebar__item-badge">{item.badge}</span>
                )}
                {hasChildren && (
                  <Icon 
                    name={isExpanded ? 'expand_more' : 'chevron_right'} 
                    className="qwanyx-sidebar__item-chevron"
                  />
                )}
              </>
            )}
          </Link>
        ) : (
          <button
            onClick={() => {
              item.onClick?.();
              if (hasChildren) toggleExpanded(item.id);
            }}
            className={`qwanyx-sidebar__item qwanyx-sidebar__item--level-${level}`}
          >
            {item.icon && (
              <span className="qwanyx-sidebar__item-icon">{item.icon}</span>
            )}
            {!collapsed && (
              <>
                <span className="qwanyx-sidebar__item-label">{item.label}</span>
                {item.badge && (
                  <span className="qwanyx-sidebar__item-badge">{item.badge}</span>
                )}
                {hasChildren && (
                  <Icon 
                    name={isExpanded ? 'expand_more' : 'chevron_right'} 
                    className="qwanyx-sidebar__item-chevron"
                  />
                )}
              </>
            )}
          </button>
        )}
        
        {hasChildren && isExpanded && !collapsed && (
          <div className="qwanyx-sidebar__children">
            {item.children!.map(child => renderItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <>
      {logo && (
        <div className="qwanyx-sidebar__logo">
          {logo}
        </div>
      )}
      
      {user && (
        <div className="qwanyx-sidebar__user">
          <Avatar 
            src={user.avatar} 
            alt={user.name}
            size={collapsed ? 'sm' : 'md'}
          />
          {!collapsed && (
            <div className="qwanyx-sidebar__user-info">
              <Text weight="semibold" size="sm">{user.name}</Text>
              {user.role && (
                <Text size="xs" className="qwanyx-sidebar__user-role">
                  {user.role}
                </Text>
              )}
            </div>
          )}
        </div>
      )}
      
      <nav className="qwanyx-sidebar__nav">
        {items.map(item => renderItem(item))}
      </nav>
      
      {footer && (
        <div className="qwanyx-sidebar__footer">
          {footer}
        </div>
      )}
      
      {collapsible && !isMobile && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCollapse}
          className="qwanyx-sidebar__collapse-btn"
        >
          <Icon name={collapsed ? 'menu' : 'x'} />
        </Button>
      )}
    </>
  );

  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="qwanyx-sidebar__mobile-toggle"
        >
          <Icon name="menu" />
        </Button>
        
        {isMobileOpen && (
          <>
            <div 
              className="qwanyx-sidebar__mobile-overlay"
              onClick={() => setIsMobileOpen(false)}
            />
            <aside 
              className={`qwanyx-sidebar qwanyx-sidebar--mobile ${className}`}
              style={{ width }}
            >
              {sidebarContent}
            </aside>
          </>
        )}
      </>
    );
  }

  return (
    <aside 
      className={`qwanyx-sidebar ${collapsed ? 'qwanyx-sidebar--collapsed' : ''} ${className}`}
      style={{ width: collapsed ? collapsedWidth : width }}
    >
      {sidebarContent}
    </aside>
  );
};

export interface SimpleSidebarProps {
  items: Array<{
    label: string;
    href?: string;
    icon?: React.ReactNode;
    badge?: string | number;
  }>;
  logo?: React.ReactNode;
  user?: {
    name: string;
    avatar?: string;
  };
}

export const SimpleSidebar: React.FC<SimpleSidebarProps> = ({
  items,
  logo,
  user
}) => {
  const sidebarItems: SidebarItem[] = items.map((item, index) => ({
    id: `item-${index}`,
    ...item
  }));

  return (
    <Sidebar
      items={sidebarItems}
      logo={logo}
      user={user}
      collapsible={true}
    />
  );
};