import { classNames } from '../../utils';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({ className, variant = 'text', width, height, animation = 'pulse' }: SkeletonProps) {
  const baseStyles = 'bg-gray-200 rounded overflow-hidden';
  
  const animations = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_1.5s_infinite]',
    none: ''
  };

  const variantStyles = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  return (
    <div
      className={classNames(
        baseStyles,
        variantStyles[variant],
        animations[animation],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export function SkeletonText({ lines = 3, className, ...props }: { lines?: number; className?: string } & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={classNames('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '60%' : '100%'} {...props} />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, ...props }: { className?: string } & Omit<SkeletonProps, 'variant'>) {
  return (
    <div className={classNames('space-y-4 p-6 bg-white border border-gray-200 rounded-xl', className)}>
      <div className="flex items-center gap-4">
        <Skeleton variant="circular" width={48} height={48} {...props} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="text" width="40%" height={20} {...props} />
          <Skeleton variant="text" width="60%" height={16} {...props} />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width="100%" height={16} {...props} />
        <Skeleton variant="text" width="80%" height={16} {...props} />
        <Skeleton variant="text" width="60%" height={16} {...props} />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className }: { rows?: number; columns?: number; className?: string }) {
  return (
    <div className={classNames('overflow-x-auto', className)}>
      <table className="w-full" role="grid" aria-busy="true">
        <thead>
          <tr>
            {Array.from({ length: columns }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton variant="text" width="80%" height={16} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-4 py-3">
                  <Skeleton variant="text" width="90%" height={16} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonList({ items = 5, className }: { items?: number; className?: string }) {
  return (
    <div className={classNames('space-y-3', className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg">
          <Skeleton variant="circular" width={40} height={40} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="30%" height={18} />
            <Skeleton variant="text" width="50%" height={14} />
          </div>
          <Skeleton variant="text" width={60} height={24} />
        </div>
      ))}
    </div>
  );
}