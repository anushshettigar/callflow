import { forwardRef } from 'react';
import * as React from 'react';
import { classNames } from '../../utils';

interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate, onChange, label, id, disabled, ...props }, ref) => {
    const checkboxRef = ref as React.RefObject<HTMLInputElement>;
    const generatedId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <label className={classNames('inline-flex items-center gap-2 cursor-pointer', className)}>
        <input
          ref={checkboxRef}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          id={generatedId}
          disabled={disabled}
          className={classNames(
            'w-4 h-4 rounded border-gray-300 text-blue-600',
            'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          {...props}
        />
        {label && <span className="text-sm text-gray-700">{label}</span>}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';