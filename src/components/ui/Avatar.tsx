import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import * as React from 'react';
import { classNames } from '../../utils';
import { getInitials } from '../../utils';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  shape?: 'circle' | 'square';
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', status, shape = 'circle', ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl'
    };

    const statusSizes = {
      xs: 'w-1.5 h-1.5',
      sm: 'w-2 h-2',
      md: 'w-2.5 h-2.5',
      lg: 'w-3 h-3',
      xl: 'w-4 h-4'
    };

    const statusColors = {
      online: 'bg-green-500',
      offline: 'bg-gray-400',
      busy: 'bg-red-500',
      away: 'bg-yellow-500'
    };

    const shapes = {
      circle: 'rounded-full',
      square: 'rounded-lg'
    };

    const initials = name ? getInitials(name) : '?';

    return (
      <div
        ref={ref}
        className={classNames(
          'relative inline-flex items-center justify-center bg-gray-100 font-medium text-gray-700 overflow-hidden',
          sizes[size],
          shapes[shape],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : (
          <span aria-hidden="true">{initials}</span>
        )}
        {status && (
          <span
            className={classNames(
              'absolute bottom-0 right-0 border-2 border-white',
              statusSizes[size],
              'rounded-full',
              statusColors[status]
            )}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function AvatarGroup({ children, max = 5, size = 'md', className }: AvatarGroupProps) {
  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  const sizes = {
    xs: '-ml-1',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5'
  };

  return (
    <div className={classNames('flex', className)} role="group" aria-label={`${childrenArray.length} people`}>
      {visibleChildren.map((child, index) => {
        const childElement = child as React.ReactElement<{ className?: string; size?: string }>;
        return React.cloneElement(childElement, {
          key: index,
          className: classNames(
            childElement.props.className,
            index > 0 && sizes[size]
          ),
          size
        });
      })}
      {remainingCount > 0 && (
        <div
          className={classNames(
            'inline-flex items-center justify-center bg-gray-100 text-gray-600 font-medium border-2 border-white',
            sizes[size]
          )}
          style={{ borderRadius: '50%' }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}