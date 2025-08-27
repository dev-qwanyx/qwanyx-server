import React, { useState, useRef, useEffect, useMemo, useCallback, KeyboardEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from './Icon';
// import { Avatar } from './Avatar';
// import { Badge } from './Badge';
import { Input } from './Input';
// import { Checkbox } from './Checkbox';
import { Spinner } from './Spinner';

// Beautiful custom scrollbar styles
const scrollbarStyles = `
  .superdropdown-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
  }
  
  .superdropdown-scroll::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 10px;
    margin: 8px 0;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.2), rgba(156, 163, 175, 0.4));
    border-radius: 10px;
    border: 1px solid transparent;
    background-clip: content-box;
    transition: all 0.3s ease;
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.4), rgba(156, 163, 175, 0.6));
    box-shadow: 0 0 0 1px rgba(156, 163, 175, 0.2);
  }
  
  .superdropdown-scroll::-webkit-scrollbar-thumb:active {
    background: linear-gradient(180deg, rgba(156, 163, 175, 0.5), rgba(156, 163, 175, 0.7));
  }
  
  /* Dark mode scrollbar */
  @media (prefers-color-scheme: dark) {
    .superdropdown-scroll::-webkit-scrollbar-thumb {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.2));
    }
    
    .superdropdown-scroll::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.3));
      box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
    }
    
    .superdropdown-scroll::-webkit-scrollbar-thumb:active {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.4));
    }
  }
  
  /* Hide scrollbar arrows */
  .superdropdown-scroll::-webkit-scrollbar-button {
    display: none;
  }
  
  /* Smooth scroll behavior */
  .superdropdown-scroll {
    scroll-behavior: smooth;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('superdropdown-styles')) {
  const style = document.createElement('style');
  style.id = 'superdropdown-styles';
  style.innerHTML = scrollbarStyles;
  document.head.appendChild(style);
}

// Types for the ultimate dropdown
export interface DropdownOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: string | React.ReactNode;
  avatar?: string;
  avatarAlt?: string;
  disabled?: boolean;
  group?: string;
  tags?: string[];
  status?: 'online' | 'offline' | 'busy' | 'away';
  badge?: string | number;
  color?: string;
  command?: string; // Keyboard shortcut
  preview?: React.ReactNode; // Preview content on hover
  children?: DropdownOption[]; // For nested options
  recent?: boolean;
  pinned?: boolean;
  meta?: any; // Additional metadata
}

export interface SuperDropdownProps {
  // Core props
  options: DropdownOption[];
  value?: string | number | (string | number)[];
  onChange?: (value: any) => void;
  placeholder?: string;
  disabled?: boolean;
  
  // Display modes
  mode?: 'select' | 'combobox' | 'command' | 'multiselect' | 'tree';
  
  // Positioning modes
  dropdownMode?: 'attached' | 'fullscreen' | 'fullHeight' | 'fill';
  
  // Search & Filter
  searchable?: boolean;
  fuzzySearch?: boolean;
  searchPlaceholder?: string;
  createOption?: boolean | ((inputValue: string) => DropdownOption);
  filterOption?: (option: DropdownOption, searchValue: string) => boolean;
  aiSuggest?: boolean; // Future AI integration
  
  // Visual options
  showAvatars?: boolean;
  showIcons?: boolean;
  showDescriptions?: boolean;
  showPreview?: boolean;
  showTags?: boolean;
  showStatus?: boolean;
  showBadges?: boolean;
  showCheckboxes?: boolean; // For multiselect
  
  // Organization
  grouped?: boolean;
  nested?: boolean;
  showBreadcrumbs?: boolean;
  maxRecentItems?: number;
  showPinnedSection?: boolean;
  
  // Performance
  virtualScroll?: boolean;
  itemHeight?: number;
  maxHeight?: number;
  asyncLoad?: (searchValue: string) => Promise<DropdownOption[]>;
  loading?: boolean;
  
  // Interactions
  clearable?: boolean;
  closeOnSelect?: boolean;
  blurOnSelect?: boolean;
  openOnFocus?: boolean;
  autoFocus?: boolean;
  
  // Animations
  animation?: 'none' | 'fade' | 'slide' | 'scale' | 'spring' | 'morph';
  animationDuration?: number;
  
  // Appearance
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'outlined' | 'filled' | 'ghost' | 'glass';
  color?: string;
  fullWidth?: boolean;
  className?: string;
  dropdownClassName?: string;
  
  // Position
  position?: 'auto' | 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  offset?: number;
  
  // Events
  onOpen?: () => void;
  onClose?: () => void;
  onSearch?: (value: string) => void;
  onCreate?: (value: string) => void;
  onHover?: (option: DropdownOption) => void;
}

// Fuzzy search implementation
function fuzzyMatch(str: string, pattern: string): boolean {
  pattern = pattern.toLowerCase();
  str = str.toLowerCase();
  
  let patternIdx = 0;
  let strIdx = 0;
  
  while (strIdx < str.length && patternIdx < pattern.length) {
    if (str[strIdx] === pattern[patternIdx]) {
      patternIdx++;
    }
    strIdx++;
  }
  
  return patternIdx === pattern.length;
}

// Main component
export const SuperDropdown: React.FC<SuperDropdownProps> = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  mode = 'select',
  dropdownMode = 'attached',
  searchable = false,
  fuzzySearch = false,
  searchPlaceholder = 'Search...',
  createOption = false,
  filterOption,
  showAvatars = false,
  showIcons = false,
  showDescriptions = false,
  showPreview = false,
  showTags = false,
  showStatus = false,
  showBadges = false,
  showCheckboxes = false,
  grouped = false,
  nested: _nested = false,
  showBreadcrumbs: _showBreadcrumbs = false,
  maxRecentItems = 5,
  showPinnedSection = false,
  virtualScroll: _virtualScroll = false,
  itemHeight = 40,
  maxHeight = 600,
  asyncLoad: _asyncLoad,
  loading = false,
  clearable = false,
  closeOnSelect = true,
  blurOnSelect: _blurOnSelect = true,
  openOnFocus: _openOnFocus = false,
  autoFocus: _autoFocus = false,
  animation = 'spring',
  animationDuration: _animationDuration = 200,
  size = 'md',
  variant = 'default',
  color = 'primary',
  fullWidth = false,
  className = '',
  dropdownClassName = '',
  position = 'auto',
  align: _align = 'start',
  offset = 4,
  onOpen: _onOpen,
  onClose,
  onSearch,
  onCreate,
  onHover,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [recentItems, setRecentItems] = useState<string[]>([]);
  const [pinnedItems, _setPinnedItems] = useState<string[]>([]);
  const [previewOption, setPreviewOption] = useState<DropdownOption | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, height: 400 });
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number>(-1);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Multi-select state
  const isMulti = mode === 'multiselect';
  const selectedValues = isMulti ? (value as (string | number)[]) || [] : value ? [value] : [];
  
  // Filter options based on search
  const filteredOptions = useMemo(() => {
    let filtered = [...options];
    
    // Apply search filter
    if (searchValue) {
      if (filterOption) {
        filtered = filtered.filter(opt => filterOption(opt, searchValue));
      } else if (fuzzySearch) {
        filtered = filtered.filter(opt => 
          fuzzyMatch(opt.label, searchValue) || 
          (opt.description && fuzzyMatch(opt.description, searchValue))
        );
      } else {
        const search = searchValue.toLowerCase();
        filtered = filtered.filter(opt => 
          opt.label.toLowerCase().includes(search) ||
          (opt.description && opt.description.toLowerCase().includes(search))
        );
      }
    }
    
    // Sort by pinned, recent, then alphabetical
    if (showPinnedSection || maxRecentItems > 0) {
      filtered.sort((a, b) => {
        const aPinned = pinnedItems.includes(String(a.value));
        const bPinned = pinnedItems.includes(String(b.value));
        const aRecent = recentItems.includes(String(a.value));
        const bRecent = recentItems.includes(String(b.value));
        
        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;
        if (aRecent && !bRecent) return -1;
        if (!aRecent && bRecent) return 1;
        
        return a.label.localeCompare(b.label);
      });
    }
    
    return filtered;
  }, [options, searchValue, filterOption, fuzzySearch, pinnedItems, recentItems, showPinnedSection, maxRecentItems]);
  
  // Group options if needed
  const groupedOptions = useMemo(() => {
    if (!grouped) return { '': filteredOptions };
    
    const groups: Record<string, DropdownOption[]> = {};
    filteredOptions.forEach(opt => {
      const group = opt.group || 'Other';
      if (!groups[group]) groups[group] = [];
      groups[group].push(opt);
    });
    
    return groups;
  }, [grouped, filteredOptions]);
  
  // Calculate dropdown position based on dropdownMode
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const dropdownHeight = Math.min(maxHeight, 400);
      
      let top = rect.bottom + offset;
      let left = rect.left;
      let width = rect.width;
      let height = dropdownHeight;
      
      // Different positioning based on dropdownMode
      switch (dropdownMode) {
        case 'fullscreen':
          // Full screen mode (mainly for mobile)
          top = 0;
          left = 0;
          width = viewportWidth;
          height = viewportHeight;
          break;
          
        case 'fullHeight':
          // Full viewport height, use component width
          top = 0;
          left = rect.left;
          width = rect.width;
          height = viewportHeight;
          break;
          
        case 'fill':
          // Fill parent container (great for sidebars)
          // Get parent dimensions
          const parent = containerRef.current.parentElement;
          if (parent) {
            const parentRect = parent.getBoundingClientRect();
            top = parentRect.top;
            left = parentRect.left;
            width = parentRect.width;
            height = parentRect.height;
          }
          break;
          
        case 'attached':
        default:
          // Default attached mode - dropdown attached to component
          const spaceBelow = viewportHeight - rect.bottom;
          const spaceAbove = rect.top;
          
          // let _actualPosition = position;
          
          if (position === 'auto') {
            if (spaceBelow < maxHeight && spaceAbove > spaceBelow) {
              top = rect.top - maxHeight - offset;
              // actualPosition = 'top';
            } else {
              // actualPosition = 'bottom';
            }
          } else if (position === 'top') {
            top = rect.top - maxHeight - offset;
          }
          
          // Check if dropdown would go off right side
          if (left + rect.width > viewportWidth) {
            left = viewportWidth - rect.width - 10;
          }
          break;
      }
      
      setDropdownPosition({
        top,
        left,
        width,
        height,
      });
    }
  }, [isOpen, position, maxHeight, offset, dropdownMode]);
  
  // Lock body scroll when dropdown is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      
      // Lock body scroll
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;
      
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      
      return () => {
        // Restore body scroll
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        
        // Restore scroll position
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);
  
  // Handle click outside to close dropdown
  useEffect(() => {
    if (!isOpen) return;
    
    const handleClickOutside = (e: MouseEvent) => {
      // Check if click is outside both the container and dropdown
      if (
        containerRef.current && 
        !containerRef.current.contains(e.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
        onClose?.();
      }
    };
    
    // Add event listener with slight delay to avoid immediate close
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 100);
    
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }
    
    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchValue('');
        setHighlightedIndex(-1);
        onClose?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
        
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleSelect(filteredOptions[highlightedIndex], highlightedIndex);
        }
        break;
        
      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, filteredOptions, highlightedIndex]);
  
  // Handle option selection with multi-select support
  const handleSelect = useCallback((option: DropdownOption, index: number, event?: React.MouseEvent) => {
    if (option.disabled) return;
    
    if (isMulti) {
      let newValue = [...selectedValues];
      
      // Check for modifier keys
      const isShiftClick = event?.shiftKey;
      const isCtrlOrCmdClick = event?.ctrlKey || event?.metaKey;
      
      if (isShiftClick && lastSelectedIndex !== -1) {
        // Shift+Click: Select range
        const start = Math.min(lastSelectedIndex, index);
        const end = Math.max(lastSelectedIndex, index);
        
        // Get all options in range that aren't disabled
        const optionsInRange = filteredOptions
          .slice(start, end + 1)
          .filter(opt => !opt.disabled)
          .map(opt => opt.value);
        
        // Add all options in range that aren't already selected
        optionsInRange.forEach(val => {
          if (!newValue.includes(val)) {
            newValue.push(val);
          }
        });
      } else if (isCtrlOrCmdClick || !event) {
        // Ctrl/Cmd+Click or programmatic selection: Toggle single item
        if (selectedValues.includes(option.value)) {
          newValue = newValue.filter(v => v !== option.value);
        } else {
          newValue.push(option.value);
        }
      } else {
        // Regular click: Toggle single item (default behavior for multi-select)
        if (selectedValues.includes(option.value)) {
          newValue = newValue.filter(v => v !== option.value);
        } else {
          newValue.push(option.value);
        }
      }
      
      onChange?.(newValue);
      setLastSelectedIndex(index);
      // Don't close for multi-select
    } else {
      onChange?.(option.value);
      
      // Add to recent items
      setRecentItems(prev => {
        const updated = [String(option.value), ...prev.filter(v => v !== String(option.value))];
        return updated.slice(0, maxRecentItems);
      });
      
      if (closeOnSelect) {
        setIsOpen(false);
      }
    }
  }, [isMulti, selectedValues, onChange, closeOnSelect, maxRecentItems, filteredOptions, lastSelectedIndex]);
  
  // Animation variants
  const dropdownVariants = {
    none: {},
    fade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    },
    slide: {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 }
    },
    scale: {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      exit: { opacity: 0, scale: 0.95 }
    },
    spring: {
      initial: { opacity: 0, scale: 0.95, y: -10 },
      animate: { 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 25
        }
      },
      exit: { opacity: 0, scale: 0.95, y: -10 }
    },
    morph: {
      initial: { opacity: 0, scale: 0, borderRadius: '50%' },
      animate: { 
        opacity: 1, 
        scale: 1, 
        borderRadius: 'var(--radius)',
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20
        }
      },
      exit: { opacity: 0, scale: 0, borderRadius: '50%' }
    }
  };
  
  // Size mappings
  const sizeStyles = {
    xs: { padding: '4px 8px', fontSize: '12px', minHeight: '24px' },
    sm: { padding: '6px 12px', fontSize: '14px', minHeight: '32px' },
    md: { padding: '8px 16px', fontSize: '16px', minHeight: '40px' },
    lg: { padding: '10px 20px', fontSize: '18px', minHeight: '48px' },
    xl: { padding: '12px 24px', fontSize: '20px', minHeight: '56px' }
  };
  
  // Color mappings
  // const _colors = {
  //   primary: 'var(--primary)',
  //   secondary: 'var(--secondary)',
  //   accent: 'var(--accent)',
  //   success: 'var(--success)',
  //   warning: 'var(--warning)',
  //   error: 'var(--error)',
  //   info: 'var(--info)',
  // };
  
  // Render option content
  const renderOption = (option: DropdownOption, index: number) => {
    const isSelected = selectedValues.includes(option.value);
    const isHighlighted = index === highlightedIndex;
    const isPinned = pinnedItems.includes(String(option.value));
    const isRecent = recentItems.includes(String(option.value));
    
    // Don't use animations for multi-select to avoid checkbox movement
    const itemContent = (
      <div
        key={option.value}
        role="option"
        aria-selected={isSelected}
        onClick={(e) => handleSelect(option, index, e)}
        onMouseEnter={() => {
          setHighlightedIndex(index);
          setPreviewOption(showPreview ? option : null);
          onHover?.(option);
        }}
        onMouseLeave={() => setPreviewOption(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 16px',
          cursor: option.disabled ? 'not-allowed' : 'pointer',
          backgroundColor: isHighlighted && isSelected ? 'rgba(var(--primary), 0.2)' :
                          isHighlighted ? 'rgba(var(--primary), 0.1)' : 
                          isSelected ? 'rgba(var(--primary), 0.15)' : 'transparent',
          opacity: option.disabled ? 0.5 : 1,
          borderRadius: 'var(--radius-sm)',
          position: 'relative',
          transition: 'background-color 0.15s ease',
          minHeight: `${itemHeight}px`,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none',
        }}
      >
        
        {/* Avatar */}
        {showAvatars && option.avatar && (
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <img
              src={option.avatar}
              alt={option.avatarAlt || option.label}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid rgb(var(--border))',
              }}
            />
            {showStatus && option.status && (
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: '2px solid rgb(var(--background))',
                  backgroundColor: 
                    option.status === 'online' ? '#10b981' :
                    option.status === 'busy' ? '#ef4444' :
                    option.status === 'away' ? '#f59e0b' : '#6b7280',
                }}
              />
            )}
          </div>
        )}
        
        {/* Icon */}
        {showIcons && option.icon && (
          typeof option.icon === 'string' && option.icon.length === 1 ? (
            <div style={{ fontSize: '24px', flexShrink: 0 }}>{option.icon}</div>
          ) : typeof option.icon === 'string' ? (
            <Icon name={option.icon} size="sm" color={(option.color || color) as 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'inherit' | 'foreground' | 'muted'} />
          ) : (
            <div style={{ fontSize: '24px', flexShrink: 0 }}>{option.icon}</div>
          )
        )}
        
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            fontSize: sizeStyles[size].fontSize,
            fontWeight: isSelected ? '600' : '400',
          }}>
            {option.label}
            
            {/* Tags */}
            {showTags && option.tags && (
              <div style={{ display: 'flex', gap: '4px', marginLeft: '8px' }}>
                {option.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      padding: '2px 6px',
                      fontSize: '10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(var(--primary), 0.1)',
                      color: 'rgb(var(--primary))',
                      fontWeight: '500',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Badge */}
            {showBadges && option.badge && (
              <span
                style={{
                  padding: '2px 8px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: option.color ? `rgb(var(--${option.color}))` : 'rgb(var(--primary))',
                  color: 'white',
                  fontWeight: '600',
                  marginLeft: 'auto',
                }}
              >
                {option.badge}
              </span>
            )}
            
            {/* Status indicators */}
            {isPinned && (
              <Icon name="push_pin" size="xs" />
            )}
            {isRecent && !isPinned && (
              <Icon name="schedule" size="xs" />
            )}
          </div>
          
          {/* Description */}
          {showDescriptions && option.description && (
            <div style={{ 
              fontSize: `calc(${sizeStyles[size].fontSize} * 0.875)`,
              color: 'rgb(var(--text-secondary))',
              marginTop: '2px',
            }}>
              {option.description}
            </div>
          )}
        </div>
        
        {/* Command shortcut */}
        {option.command && (
          <kbd style={{
            padding: '2px 6px',
            backgroundColor: 'rgba(var(--border), 0.3)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '11px',
            fontFamily: 'monospace',
            color: 'rgb(var(--text-secondary))',
          }}>
            {option.command}
          </kbd>
        )}
        
      </div>
    );
    
    // Only wrap with motion for non-multiselect to avoid checkbox jumping
    if (!isMulti && !showCheckboxes) {
      return (
        <motion.div
          key={option.value}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {itemContent}
        </motion.div>
      );
    }
    
    return itemContent;
  };
  
  // Get display value
  const getDisplayValue = () => {
    if (isMulti) {
      const selected = options.filter(opt => selectedValues.includes(opt.value));
      if (selected.length === 0) return <span style={{ color: 'rgb(var(--text-secondary))' }}>{placeholder}</span>;
      if (selected.length <= 2) {
        return (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {selected.map(opt => (
              <span
                key={opt.value}
                style={{
                  padding: '2px 8px',
                  fontSize: '12px',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'rgba(var(--primary), 0.1)',
                  color: 'rgb(var(--primary))',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                {opt.icon && typeof opt.icon === 'string' && opt.icon.length <= 2 && (
                  <span style={{ fontSize: '14px' }}>{opt.icon}</span>
                )}
                {opt.label}
              </span>
            ))}
          </div>
        );
      }
      return (
        <span style={{ 
          padding: '2px 8px',
          fontSize: '12px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'rgba(var(--primary), 0.1)',
          color: 'rgb(var(--primary))',
          fontWeight: '600',
        }}>
          {selected.length} items selected
        </span>
      );
    } else {
      const selected = options.find(opt => opt.value === value);
      return selected ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {selected.icon && typeof selected.icon === 'string' && selected.icon.length <= 2 && (
            <span style={{ fontSize: '18px' }}>{selected.icon}</span>
          )}
          <span>{selected.label}</span>
        </div>
      ) : <span style={{ color: 'rgb(var(--text-secondary))' }}>{placeholder}</span>;
    }
  };
  
  return (
    <>
      {/* Main trigger */}
      <div
        ref={containerRef}
        className={className}
        style={{
          position: 'relative',
          width: fullWidth ? '100%' : 'auto',
        }}
      >
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          style={{
            ...sizeStyles[size],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            borderRadius: 'var(--radius)',
            border: variant === 'outlined' ? '2px solid rgb(var(--border))' : 'none',
            backgroundColor: variant === 'filled' ? 'rgb(var(--surface))' : 
                           variant === 'glass' ? 'rgba(255, 255, 255, 0.1)' : 'rgb(var(--background))',
            backdropFilter: variant === 'glass' ? 'blur(10px)' : 'none',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'all 0.2s ease',
            boxShadow: isOpen ? `0 0 0 3px rgba(var(--${color}), 0.1)` : 'var(--shadow-sm)',
            width: '100%',
          }}
        >
          <div style={{ 
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            minHeight: '20px',
          }}>
            {getDisplayValue()}
          </div>
          
          {/* Clear button */}
          {clearable && value && !disabled && (
            <Icon
              name="close"
              size="xs"
              color="secondary"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation();
                onChange?.(isMulti ? [] : undefined);
              }}
            />
          )}
          
          {/* Dropdown arrow */}
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <Icon name="expand_more" size="sm" color="secondary" />
          </motion.div>
        </div>
      </div>
      
      {/* Dropdown portal with backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(2px)',
                zIndex: 9998,
              }}
              onClick={() => {
                setIsOpen(false);
                setSearchValue('');
                setHighlightedIndex(-1);
                onClose?.();
              }}
            />
            
            {/* Dropdown */}
            <motion.div
              ref={dropdownRef}
              role="listbox"
              aria-multiselectable={isMulti}
            {...(animation !== 'none' ? dropdownVariants[animation] : {})}
            style={{
              position: 'fixed',
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              height: dropdownMode === 'fullscreen' || dropdownMode === 'fullHeight' || dropdownMode === 'fill' 
                ? dropdownPosition.height 
                : undefined,
              maxHeight: dropdownMode === 'attached' ? `${maxHeight}px` : undefined,
              overflowY: 'hidden', // Let inner div handle scrolling
              overflowX: 'hidden',
              zIndex: 9999, // Above the backdrop (9998)
              backgroundColor: variant === 'glass' ? 'rgba(255, 255, 255, 0.95)' : 'rgb(var(--background))',
              backdropFilter: variant === 'glass' ? 'blur(20px)' : 'none',
              border: dropdownMode === 'fullscreen' ? 'none' : '1px solid rgb(var(--border))',
              borderRadius: dropdownMode === 'fullscreen' ? '0' : 'var(--radius-lg)',
              boxShadow: dropdownMode === 'fullscreen' ? 'none' : 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column',
            }}
            className={dropdownClassName}
            onWheel={(e: React.WheelEvent) => {
              // Prevent page scroll when dropdown is open
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            {/* Header with close button for fullscreen mode */}
            {dropdownMode === 'fullscreen' && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 16px',
                borderBottom: '1px solid rgb(var(--border))',
                flexShrink: 0,
              }}>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'rgb(var(--text))',
                }}>
                  {placeholder.replace('Select', 'Choose')}
                </span>
                <motion.div
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setIsOpen(false);
                    setSearchValue('');
                    setHighlightedIndex(-1);
                    onClose?.();
                  }}
                  style={{
                    width: '12px',
                    height: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'rgb(var(--text-secondary))',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.color = 'rgb(var(--text))';
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                    e.currentTarget.style.color = 'rgb(var(--text-secondary))';
                  }}
                >
                  <Icon name="close" size="sm" />
                </motion.div>
              </div>
            )}
            
            {/* Search input */}
            {searchable && (
              <div style={{ 
                borderBottom: '1px solid rgb(var(--border))',
                flexShrink: 0,
                backgroundColor: 'inherit',
                backdropFilter: 'inherit',
                zIndex: 1,
              }}>
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  placeholder={searchPlaceholder}
                  inputSize={size}
                  icon={<Icon name="search" size="sm" />}
                  iconPosition="left"
                  autoFocus
                  fullWidth
                  style={{ 
                    width: '100%',
                    border: 'none',
                    borderRadius: 0,
                    boxShadow: 'inset 0 -2px 4px -2px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'rgba(var(--muted), 0.05)',
                    padding: '12px 16px 12px 48px',
                  }}
                />
              </div>
            )}
            
            {/* Loading state */}
            {loading && (
              <div style={{ 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '32px',
              }}>
                <Spinner size="md" />
              </div>
            )}
            
            {/* Multi-select helper text */}
            {isMulti && filteredOptions.length > 0 && (
              <div style={{
                padding: '8px 16px',
                fontSize: '11px',
                color: 'rgb(var(--text-muted))',
                borderBottom: '1px solid rgb(var(--border))',
                backgroundColor: 'rgba(var(--muted), 0.05)',
              }}>
                💡 Click to toggle • Shift+Click for range • Ctrl/Cmd+Click for multiple
              </div>
            )}
            
            {/* Options list */}
            {!loading && (
              <div 
                className="superdropdown-scroll"
                style={{ 
                  padding: '8px',
                  flex: 1,
                  maxHeight: dropdownMode === 'attached' ? '500px' : undefined,
                  minHeight: dropdownMode === 'attached' ? '200px' : undefined,
                  overflowY: 'auto', // Only show when needed
                  overflowX: 'hidden',
                  WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
                  overscrollBehavior: 'contain', // Prevent scroll chaining
                }}
                onWheel={(e: React.WheelEvent) => {
                  // Prevent scroll from propagating to parent
                  e.stopPropagation();
                  
                  const target = e.currentTarget;
                  const delta = e.deltaY;
                  
                  // Handle the scroll manually
                  target.scrollTop += delta;
                  
                  // Always prevent default to stop page scroll
                  e.preventDefault();
                }}
                onTouchMove={(e) => {
                  // Allow touch scrolling within dropdown
                  e.stopPropagation();
                }}>
                {/* Pinned section */}
                {showPinnedSection && pinnedItems.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      padding: '4px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'rgb(var(--text-secondary))',
                      textTransform: 'uppercase',
                    }}>
                      Pinned
                    </div>
                    {filteredOptions
                      .filter(opt => pinnedItems.includes(String(opt.value)))
                      .map((opt, idx) => renderOption(opt, idx))
                    }
                  </div>
                )}
                
                {/* Recent section */}
                {maxRecentItems > 0 && recentItems.length > 0 && (
                  <div style={{ marginBottom: '8px' }}>
                    <div style={{
                      padding: '4px 16px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: 'rgb(var(--text-secondary))',
                      textTransform: 'uppercase',
                    }}>
                      Recent
                    </div>
                    {filteredOptions
                      .filter(opt => recentItems.includes(String(opt.value)))
                      .slice(0, maxRecentItems)
                      .map((opt, idx) => renderOption(opt, idx))
                    }
                  </div>
                )}
                
                {/* Grouped options */}
                {grouped ? (
                  Object.entries(groupedOptions).map(([group, opts], groupIdx) => (
                    <div key={group} style={{ marginBottom: '12px' }}>
                      {group && (
                        <div style={{
                          padding: '8px 16px 4px',
                          fontSize: '11px',
                          fontWeight: '700',
                          color: 'rgb(var(--text-secondary))',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          borderBottom: groupIdx === 0 ? 'none' : '1px solid rgba(var(--border), 0.5)',
                          marginBottom: '4px',
                          paddingTop: groupIdx === 0 ? '4px' : '12px',
                        }}>
                          {group}
                        </div>
                      )}
                      {opts.map((opt, idx) => renderOption(opt, idx))}
                    </div>
                  ))
                ) : (
                  filteredOptions.map((opt, idx) => renderOption(opt, idx))
                )}
                
                {/* Create option */}
                {createOption && searchValue && !filteredOptions.some(opt => opt.label === searchValue) && (
                  <div
                    onClick={() => {
                      if (typeof createOption === 'function') {
                        const newOption = createOption(searchValue);
                        handleSelect(newOption, filteredOptions.length);
                      } else {
                        onCreate?.(searchValue);
                      }
                      setSearchValue('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      cursor: 'pointer',
                      backgroundColor: 'rgba(var(--primary), 0.05)',
                      borderRadius: 'var(--radius-sm)',
                      marginTop: '8px',
                    }}
                  >
                    <Icon name="add" size="sm" color={color as 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'inherit' | 'foreground' | 'muted'} />
                    <span>Create "{searchValue}"</span>
                  </div>
                )}
                
                {/* Empty state */}
                {filteredOptions.length === 0 && !createOption && (
                  <div style={{
                    padding: '32px',
                    textAlign: 'center',
                    color: 'rgb(var(--text-secondary))',
                  }}>
                    No options found
                  </div>
                )}
              </div>
            )}
            
            {/* Preview pane */}
            {showPreview && previewOption && previewOption.preview && (
              <div style={{
                position: 'absolute',
                left: '100%',
                top: 0,
                marginLeft: '8px',
                width: '300px',
                padding: '16px',
                backgroundColor: 'rgb(var(--background))',
                border: '1px solid rgb(var(--border))',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-lg)',
              }}>
                {previewOption.preview}
              </div>
            )}
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

// Export simplified versions for common use cases
export const Select = (props: Omit<SuperDropdownProps, 'mode'>) => (
  <SuperDropdown {...props} mode="select" />
);

export const MultiSelect = (props: Omit<SuperDropdownProps, 'mode'>) => (
  <SuperDropdown {...props} mode="multiselect" />
);

export const Combobox = (props: Omit<SuperDropdownProps, 'mode' | 'searchable'>) => (
  <SuperDropdown {...props} mode="combobox" searchable />
);

export const CommandPalette = (props: Omit<SuperDropdownProps, 'mode' | 'searchable' | 'fuzzySearch'>) => (
  <SuperDropdown {...props} mode="command" searchable fuzzySearch />
);