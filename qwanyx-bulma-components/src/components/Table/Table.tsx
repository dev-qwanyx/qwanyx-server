import React from 'react';
import { cn } from '../../utils/classNames';

interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  bordered?: boolean;
  striped?: boolean;
  narrow?: boolean;
  hoverable?: boolean;
  fullwidth?: boolean;
  containerClassName?: string;
  scrollable?: boolean;
}

const Table = React.forwardRef<HTMLTableElement, TableProps>(({
  bordered = false,
  striped = false,
  narrow = false,
  hoverable = false,
  fullwidth = false,
  containerClassName,
  scrollable = false,
  className,
  children,
  ...rest
}, ref) => {
  const tableClasses = cn(
    'table',
    bordered && 'is-bordered',
    striped && 'is-striped',
    narrow && 'is-narrow',
    hoverable && 'is-hoverable',
    fullwidth && 'is-fullwidth',
    className
  );

  const table = (
    <table ref={ref} className={tableClasses} {...rest}>
      {children}
    </table>
  );

  if (scrollable || containerClassName) {
    const containerClasses = cn(
      'table-container',
      containerClassName
    );
    return (
      <div className={containerClasses}>
        {table}
      </div>
    );
  }

  return table;
});

Table.displayName = 'Table';

export default Table;