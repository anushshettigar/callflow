import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { classNames } from '../../utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-700',
      success: 'bg-green-100 text-green-700',
      warning: 'bg-yellow-100 text-yellow-700',
      danger: 'bg-red-100 text-red-700',
      info: 'bg-blue-100 text-blue-700',
      outline: 'bg-transparent border border-gray-300 text-gray-700'
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-2.5 py-1 text-xs',
      lg: 'px-3 py-1 text-sm'
    };

    const dotColors = {
      default: 'bg-gray-400',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      info: 'bg-blue-500',
      outline: 'bg-gray-400'
    };

    return (
      <span
        ref={ref}
        className={classNames(
          'inline-flex items-center gap-1.5 font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className={classNames('w-1.5 h-1.5 rounded-full', dotColors[variant])} />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface StatusBadgeProps {
  status: string;
  type?: 'lead' | 'call' | 'task';
}

const leadStatusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  new: { variant: 'info', label: 'New' },
  contacted: { variant: 'default', label: 'Contacted' },
  qualified: { variant: 'success', label: 'Qualified' },
  proposal: { variant: 'warning', label: 'Proposal' },
  negotiation: { variant: 'warning', label: 'Negotiation' },
  'closed-won': { variant: 'success', label: 'Closed Won' },
  'closed-lost': { variant: 'danger', label: 'Closed Lost' }
};

const callStatusConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  completed: { variant: 'success', label: 'Completed' },
  missed: { variant: 'danger', label: 'Missed' },
  declined: { variant: 'warning', label: 'Declined' },
  voicemail: { variant: 'info', label: 'Voicemail' },
  'in-progress': { variant: 'info', label: 'In Progress' }
};

const taskPriorityConfig: Record<string, { variant: BadgeProps['variant']; label: string }> = {
  high: { variant: 'danger', label: 'High' },
  medium: { variant: 'warning', label: 'Medium' },
  low: { variant: 'success', label: 'Low' }
};

export function StatusBadge({ status, type = 'lead' }: StatusBadgeProps) {
  let config: Record<string, { variant: BadgeProps['variant']; label: string }>;
  
  switch (type) {
    case 'call':
      config = callStatusConfig;
      break;
    case 'task':
      config = taskPriorityConfig;
      break;
    default:
      config = leadStatusConfig;
  }

  const { variant, label } = config[status] || { variant: 'default', label: status };
  
  return <Badge variant={variant} size="sm">{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: 'high' | 'medium' | 'low' }) {
  const config = taskPriorityConfig[priority];
  return <Badge variant={config.variant} size="sm" dot>{config.label}</Badge>;
}

export function ScoreBadge({ score }: { score: number }) {
  let variant: BadgeProps['variant'] = 'default';
  if (score >= 90) variant = 'success';
  else if (score >= 75) variant = 'info';
  else if (score >= 60) variant = 'warning';
  else variant = 'danger';
  
  return <Badge variant={variant} size="md" className="font-semibold">{score}</Badge>;
}