import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { classNames } from '../../utils';
import { generateId } from '../../utils';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = generateId('toast-');
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    if (toast.duration !== 0) {
      setTimeout(() => removeToast(id), toast.duration || 5000);
    }
    
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-max max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>,
    document.body
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 200);
  };

  useEffect(() => {
    if (toast.duration !== 0) {
      const timer = setTimeout(handleRemove, toast.duration || 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.duration, toast.id, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    warning: AlertTriangle,
    info: Info
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const Icon = icons[toast.type];

  return (
    <div
      className={classNames(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px]',
        'animate-in slide-in-from-right duration-300',
        isExiting && 'animate-out slide-out-to-right duration-200',
        colors[toast.type]
      )}
      role="alert"
      aria-live="polite"
    >
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{toast.title}</p>
        {toast.message && (
          <p className="text-sm mt-1 opacity-90">{toast.message}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {toast.action && (
          <button
            onClick={() => {
              toast.action?.onClick();
              handleRemove();
            }}
            className="text-sm font-medium underline hover:no-underline"
          >
            {toast.action.label}
          </button>
        )}
        <button
          onClick={handleRemove}
          className="p-1 rounded opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}