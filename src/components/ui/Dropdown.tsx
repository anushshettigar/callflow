import { useState, useRef, useEffect } from 'react';
import { Fragment } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Check } from 'lucide-react';
import { classNames } from '../../utils';
import { useClickOutside } from '../../hooks';

interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  danger?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  options: DropdownOption[];
  onSelect: (value: string) => void;
  align?: 'left' | 'right';
  closeOnSelect?: boolean;
}

export function Dropdown({ trigger, options, onSelect, align = 'right', closeOnSelect = true }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const handleOptionClick = (value: string) => {
    onSelect(value);
    if (closeOnSelect) setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, value: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOptionClick(value);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      triggerRef.current?.focus();
    }
  };

  if (typeof window === 'undefined') return <>{trigger}</>;

  const dropdownContent = isOpen ? (
    <div
      ref={dropdownRef}
      className={classNames(
        'fixed z-50 mt-1 min-w-[180px] bg-white border border-gray-200 rounded-lg shadow-lg py-1',
        'animate-in fade-in-0 zoom-in-95 duration-150',
        align === 'right' ? 'right-0' : 'left-0'
      )}
      role="menu"
      aria-orientation="vertical"
    >
      {options.map((option, index) => (
        <button
          key={option.value}
          onClick={() => !option.disabled && handleOptionClick(option.value)}
          onKeyDown={(e) => handleKeyDown(e, option.value)}
          disabled={option.disabled}
          role="menuitem"
          tabIndex={-1}
          className={classNames(
            'w-full px-4 py-2 text-left text-sm flex items-center gap-2',
            'focus:outline-none focus:bg-gray-50',
            option.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-50',
            option.danger && !option.disabled ? 'text-red-600 hover:bg-red-50' : ''
          )}
        >
          {option.icon && <span className="w-4 h-4 flex-shrink-0">{option.icon}</span>}
          <span>{option.label}</span>
        </button>
      ))}
    </div>
  ) : null;

  return (
    <Fragment>
      <div className="relative inline-block">
        <button
          ref={triggerRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1"
          aria-haspopup="true"
          aria-expanded={isOpen}
        >
          {trigger}
          <ChevronDown className={classNames('w-4 h-4 text-gray-500 transition-transform', isOpen && 'rotate-180')} />
        </button>
        {createPortal(dropdownContent, document.body)}
      </div>
    </Fragment>
  );
}

interface SelectDropdownProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  error?: boolean;
}

export function SelectDropdown({ value, options, onChange, placeholder, className, disabled, error }: SelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={classNames(
          'w-full px-3 py-2 bg-white border rounded-lg text-sm text-left',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          'transition-all duration-150 flex items-center justify-between',
          error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 hover:border-gray-400',
          className
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption?.label || placeholder || 'Select...'}
        </span>
        <ChevronDown className={classNames('w-4 h-4 text-gray-500 flex-shrink-0 ml-2', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border border-gray-200 rounded-lg shadow-lg py-1"
          role="listbox"
          aria-activedescendant={value}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              role="option"
              aria-selected={option.value === value}
              className={classNames(
                'w-full px-4 py-2 text-left text-sm',
                'focus:outline-none focus:bg-gray-50',
                option.value === value ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}