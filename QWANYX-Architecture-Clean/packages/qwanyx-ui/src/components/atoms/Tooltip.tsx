import React, { useState } from 'react'
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  useHover,
  useFocus,
  useDismiss,
  useRole,
  useInteractions,
  FloatingPortal,
  arrow,
  FloatingArrow
} from '@floating-ui/react'
import { Icon } from '../Icon'

export interface TooltipProps {
  content: string
  children: React.ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
  icon?: string
  delay?: number
}

export const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  icon,
  delay = 200 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const arrowRef = React.useRef(null)

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement: position,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(10),
      flip({
        fallbackAxisSideDirection: 'start',
        crossAxis: true
      }),
      shift({ padding: 5 }),
      arrow({
        element: arrowRef,
      })
    ],
  })

  const hover = useHover(context, {
    delay: {
      open: delay,
      close: 0
    }
  })
  const focus = useFocus(context)
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const { getReferenceProps, getFloatingProps } = useInteractions([
    hover,
    focus,
    dismiss,
    role,
  ])

  return (
    <>
      <div 
        ref={refs.setReference} 
        {...getReferenceProps()}
        style={{ display: 'inline-block' }}
      >
        {children}
      </div>
      {isOpen && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              zIndex: 10000,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
            {...getFloatingProps()}
          >
            {icon && <Icon name={icon} size="sm" style={{ fontSize: '16px' }} />}
            {content}
            <FloatingArrow 
              ref={arrowRef} 
              context={context}
              fill="rgba(0, 0, 0, 0.9)"
              width={10}
              height={5}
            />
          </div>
        </FloatingPortal>
      )}
    </>
  )
}