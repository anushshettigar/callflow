import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { ReactElement, ReactNode } from 'react';
import * as React from 'react';
import { classNames } from '../../utils';

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

export function Tooltip({ content, children, position = 'top', delay = 200 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900',
    right: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900'
  };

  const clonedChild = React.isValidElement(children) 
    ? React.cloneElement(children as React.ReactElement, {
        onMouseEnter: showTooltip,
        onMouseLeave: hideTooltip,
        onFocus: showTooltip,
        onBlur: hideTooltip
      } as Record<string, unknown>)
    : children;

  if (typeof window === 'undefined') return <>{clonedChild}</>;

  const tooltipContent = isVisible ? (
    <div
      ref={tooltipRef}
      className={classNames(
        'fixed z-50 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-lg',
        'whitespace-nowrap animate-in fade-in-0 zoom-in-95 duration-150',
        positions[position]
      )}
      role="tooltip"
    >
      {content}
      <div
        className={classNames(
          'absolute w-0 h-0 border-4 border-transparent',
          arrows[position]
        )}
      />
    </div>
  ) : null;

  return (
    <>
      {clonedChild}
      {createPortal(tooltipContent, document.body)}
    </>
  );
}