import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage change for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export function useLocalStorageArray<T>(key: string, initialValue: T[] = []): [
  T[],
  {
    add: (item: T) => void;
    remove: (id: string | number, idKey?: keyof T) => void;
    update: (id: string | number, updates: Partial<T>, idKey?: keyof T) => void;
    clear: () => void;
  }
] {
  const [array, setArray] = useLocalStorage<T[]>(key, initialValue);

  const add = useCallback((item: T) => {
    setArray(prev => [item, ...prev]);
  }, [setArray]);

  const remove = useCallback((id: string | number, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.filter(item => item[idKey] !== id));
  }, [setArray]);

  const update = useCallback((id: string | number, updates: Partial<T>, idKey: keyof T = 'id' as keyof T) => {
    setArray(prev => prev.map(item => 
      item[idKey] === id ? { ...item, ...updates } : item
    ));
  }, [setArray]);

  const clear = useCallback(() => {
    setArray([]);
  }, [setArray]);

  return [array, { add, remove, update, clear }];
}