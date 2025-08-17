import React from 'react';
import { Icon } from './Icon';
import { Progress } from './Progress';

export type AgileStatus = 'backlog' | 'todo' | 'doing' | 'review' | 'done' | 'blocked' | 'validated' | 'archived';

export interface AgileStatusIconProps {
  /**
   * The agile status
   */
  status: AgileStatus;
  /**
   * Progress value (0-100) - optional, will show appropriate icon based on status if not provided
   */
  progress?: number;
  /**
   * Size of the icon
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /**
   * Show label next to icon
   */
  showLabel?: boolean;
  /**
   * Additional CSS classes
   */
  className?: string;
}

// Map status to default progress values and icons
const statusConfig: Record<AgileStatus, { 
  defaultProgress: number; 
  colorClass: string;
  rgbColor: string;
  label: string;
  icon?: string;
}> = {
  backlog: {
    defaultProgress: 0,
    colorClass: 'qwanyx-text-status-backlog',
    rgbColor: 'rgb(148 163 184)', // Gray
    label: 'Backlog',
    icon: 'radio_button_unchecked'
  },
  todo: {
    defaultProgress: 0,
    colorClass: 'qwanyx-text-status-todo',
    rgbColor: 'rgb(59 130 246)', // Blue
    label: 'To Do',
    icon: 'radio_button_unchecked'
  },
  doing: {
    defaultProgress: 50,
    colorClass: 'qwanyx-text-status-doing',
    rgbColor: 'rgb(234 88 12)', // Darker Orange
    label: 'In Progress',
    icon: 'clock_loader_60'
  },
  review: {
    defaultProgress: 80,
    colorClass: 'qwanyx-text-status-review',
    rgbColor: 'rgb(168 85 247)', // Purple
    label: 'Review',
    icon: 'clock_loader_80'
  },
  done: {
    defaultProgress: 100,
    colorClass: 'qwanyx-text-status-done',
    rgbColor: 'rgb(34 197 94)', // Green
    label: 'Done',
    icon: 'check_circle'
  },
  blocked: {
    defaultProgress: -1, // Special case - will use blocked icon
    colorClass: 'qwanyx-text-status-blocked',
    rgbColor: 'rgb(239 68 68)', // Red
    label: 'Blocked',
    icon: 'block'
  },
  validated: {
    defaultProgress: 100,
    colorClass: 'qwanyx-text-status-validated',
    rgbColor: 'rgb(20 184 166)', // Teal
    label: 'Validated',
    icon: 'verified'
  },
  archived: {
    defaultProgress: 100,
    colorClass: 'qwanyx-text-status-archived',
    rgbColor: 'rgb(71 85 105)', // Dark gray
    label: 'Archived',
    icon: 'archive'
  }
};

/**
 * AgileStatusIcon - A molecule combining Progress/Icon with agile status colors
 */
export const AgileStatusIcon: React.FC<AgileStatusIconProps> = ({
  status,
  progress,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const config = statusConfig[status];
  const actualProgress = progress ?? config.defaultProgress;
  
  // Map size for icon
  const iconSizeMap = {
    xs: 'sm' as const,
    sm: 'md' as const,
    md: 'lg' as const,
    lg: 'xl' as const,
    xl: '2xl' as const,
  };

  // For blocked status or when we have a specific icon override
  if (actualProgress === -1 || (actualProgress === 100 && config.icon && config.icon !== 'check_circle')) {
    return (
      <div className={`qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${className}`}>
        <span style={{ color: config.rgbColor }}>
          <Icon 
            name={config.icon!}
            size={iconSizeMap[size]}
            color="inherit"
            variant="outlined"
          />
        </span>
        {showLabel && (
          <span className="qwanyx-text-sm" style={{ color: config.rgbColor }}>
            {config.label}
          </span>
        )}
      </div>
    );
  }

  // Use progress icon for partial completion
  let iconName = 'radio_button_unchecked';
  if (actualProgress === 0) {
    iconName = 'radio_button_unchecked';
  } else if (actualProgress === 100) {
    iconName = 'check_circle';
  } else if (actualProgress <= 10) {
    iconName = 'clock_loader_10';
  } else if (actualProgress <= 20) {
    iconName = 'clock_loader_20';
  } else if (actualProgress <= 40) {
    iconName = 'clock_loader_40';
  } else if (actualProgress <= 60) {
    iconName = 'clock_loader_60';
  } else if (actualProgress <= 80) {
    iconName = 'clock_loader_80';
  } else if (actualProgress <= 90) {
    iconName = 'clock_loader_90';
  } else {
    iconName = 'clock_loader_90';
  }

  return (
    <div className={`qwanyx-inline-flex qwanyx-items-center qwanyx-gap-2 ${className}`}>
      <span style={{ color: config.rgbColor }}>
        <Icon 
          name={iconName}
          size={iconSizeMap[size]}
          color="inherit"
          variant="outlined"
        />
      </span>
      {showLabel && (
        <span className="qwanyx-text-sm" style={{ color: config.rgbColor }}>
          {config.label}
          {progress !== undefined && ` (${progress}%)`}
        </span>
      )}
    </div>
  );
};

/**
 * AgileStatusBadge - A molecule combining Badge with agile status
 */
export interface AgileStatusBadgeProps {
  status: AgileStatus;
  progress?: number;
  showIcon?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'solid' | 'outline' | 'subtle';
  className?: string;
}

export const AgileStatusBadge: React.FC<AgileStatusBadgeProps> = ({
  status,
  progress,
  showIcon = true,
  variant = 'solid',
  className = ''
}) => {
  const config = statusConfig[status];
  
  const statusBgColors = {
    backlog: 'rgb(148 163 184)', // Gray
    todo: 'rgb(59 130 246)', // Blue
    doing: 'rgb(234 88 12)', // Darker Orange
    review: 'rgb(168 85 247)', // Purple
    done: 'rgb(34 197 94)', // Green
    blocked: 'rgb(239 68 68)', // Red
    validated: 'rgb(20 184 166)', // Teal
    archived: 'rgb(71 85 105)', // Dark gray
  };

  const badgeStyle = variant === 'solid' 
    ? { 
        backgroundColor: statusBgColors[status],
        color: 'white',
        border: 'none',
        padding: '6px 12px',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500'
      }
    : variant === 'outline'
    ? {
        backgroundColor: 'transparent',
        color: statusBgColors[status],
        border: `2px solid ${statusBgColors[status]}`,
        padding: '6px 12px',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500'
      }
    : {
        backgroundColor: `${statusBgColors[status]}20`, // 20% opacity
        color: statusBgColors[status],
        border: 'none',
        padding: '6px 12px',
        borderRadius: '9999px',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '500'
      };

  return (
    <div 
      className={className}
      style={badgeStyle}
    >
      {showIcon && (() => {
        const actualProgress = progress ?? config.defaultProgress;
        let iconName = 'radio_button_unchecked';
        
        if (actualProgress === -1 || (status === 'blocked')) {
          iconName = 'block';
        } else if (status === 'validated') {
          iconName = 'verified';
        } else if (status === 'archived') {
          iconName = 'archive';
        } else if (actualProgress === 0) {
          iconName = 'radio_button_unchecked';
        } else if (actualProgress === 100) {
          iconName = 'check_circle';
        } else if (actualProgress <= 10) {
          iconName = 'clock_loader_10';
        } else if (actualProgress <= 20) {
          iconName = 'clock_loader_20';
        } else if (actualProgress <= 40) {
          iconName = 'clock_loader_40';
        } else if (actualProgress <= 60) {
          iconName = 'clock_loader_60';
        } else if (actualProgress <= 80) {
          iconName = 'clock_loader_80';
        } else if (actualProgress <= 90) {
          iconName = 'clock_loader_90';
        } else {
          iconName = 'clock_loader_90';
        }
        
        return (
          <span style={{ color: badgeStyle.color, display: 'inline-flex', alignItems: 'center' }}>
            <Icon 
              name={iconName}
              size="xs"
              color="inherit"
              variant="outlined"
            />
          </span>
        );
      })()}
      <span>
        {config.label}
        {progress !== undefined && ` (${progress}%)`}
      </span>
    </div>
  );
};

/**
 * AgileTaskCard - A molecule for displaying task with status
 */
export interface AgileTaskCardProps {
  title: string;
  status: AgileStatus;
  progress?: number;
  assignee?: string;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: string;
  description?: string;
  className?: string;
}

export const AgileTaskCard: React.FC<AgileTaskCardProps> = ({
  title,
  status,
  progress,
  assignee,
  priority,
  dueDate,
  description,
  className = ''
}) => {
  const priorityColors = {
    low: 'rgb(148 163 184)', // Gray
    medium: 'rgb(59 130 246)', // Blue  
    high: 'rgb(234 88 12)', // Darker Orange
    critical: 'rgb(239 68 68)' // Red
  };

  return (
    <div className={`qwanyx-p-4 qwanyx-border qwanyx-rounded-lg qwanyx-bg-white qwanyx-shadow-sm hover:qwanyx-shadow-md qwanyx-transition-shadow ${className}`}>
      <div className="qwanyx-space-y-3">
        {/* Header */}
        <div className="qwanyx-flex qwanyx-justify-between qwanyx-items-start">
          <h3 className="qwanyx-font-semibold qwanyx-text-gray-900">{title}</h3>
          <AgileStatusIcon status={status} progress={progress} size="sm" />
        </div>

        {/* Description */}
        {description && (
          <p className="qwanyx-text-sm qwanyx-text-gray-600">{description}</p>
        )}

        {/* Meta */}
        <div className="qwanyx-flex qwanyx-items-center qwanyx-justify-between qwanyx-text-xs">
          <div className="qwanyx-flex qwanyx-gap-3">
            {assignee && (
              <span className="qwanyx-text-gray-500">
                <Icon name="person" size="xs" className="qwanyx-inline qwanyx-mr-1" />
                {assignee}
              </span>
            )}
            {dueDate && (
              <span className="qwanyx-text-gray-500">
                <Icon name="calendar_today" size="xs" className="qwanyx-inline qwanyx-mr-1" />
                {dueDate}
              </span>
            )}
          </div>
          {priority && (
            <span className="qwanyx-font-medium" style={{ color: priorityColors[priority] }}>
              {priority.toUpperCase()}
            </span>
          )}
        </div>

        {/* Progress bar if in progress */}
        {status === 'doing' && progress !== undefined && (
          <Progress type="bar" value={progress} size="xs" color="info" />
        )}
      </div>
    </div>
  );
};