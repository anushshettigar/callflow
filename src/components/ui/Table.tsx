import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { classNames } from '../../utils';
import { Checkbox } from './Checkbox';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  width?: string;
  sortable?: boolean;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  striped?: boolean;
  hoverable?: boolean;
}

export function Table<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  selectable,
  selectedKeys = new Set(),
  onSelectionChange,
  loading,
  emptyMessage = 'No data available',
  className,
  striped = true,
  hoverable = true
}: TableProps<T>) {
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (selectable) {
      const allSelected = data.length > 0 && data.every(row => selectedKeys.has(keyExtractor(row)));
      setSelectAll(allSelected);
    }
  }, [data, selectedKeys, keyExtractor, selectable]);

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    const newSelection = new Set<string>();
    if (!selectAll) {
      data.forEach(row => newSelection.add(keyExtractor(row)));
    }
    onSelectionChange(newSelection);
  };

  const handleRowSelect = (row: T) => {
    if (!onSelectionChange) return;
    const key = keyExtractor(row);
    const newSelection = new Set(selectedKeys);
    if (newSelection.has(key)) {
      newSelection.delete(key);
    } else {
      newSelection.add(key);
    }
    onSelectionChange(newSelection);
  };

  if (loading) {
    return (
      <div className="overflow-x-auto">
        <table className="w-full" role="grid" aria-busy="true">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-12 text-center">
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading...
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={classNames('overflow-x-auto', className)}>
      <table className="w-full" role="grid">
        <thead className="bg-gray-50">
          <tr>
            {selectable && (
              <th className="px-4 py-3 text-left">
                <Checkbox
                  checked={selectAll}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                className={classNames(
                  'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
                  col.className
                )}
                style={{ width: col.width }}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-12 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={keyExtractor(row)}
                onClick={() => onRowClick?.(row)}
                className={classNames(
                  'transition-colors',
                  striped && rowIndex % 2 === 1 && 'bg-gray-50',
                  hoverable && 'hover:bg-gray-50',
                  onRowClick && 'cursor-pointer',
                  selectedKeys.has(keyExtractor(row)) && 'bg-blue-50'
                )}
              >
                {selectable && (
                  <td className="px-4 py-3">
                    <Checkbox
                      checked={selectedKeys.has(keyExtractor(row))}
                      onChange={() => handleRowSelect(row)}
                      aria-label={`Select row ${rowIndex + 1}`}
                    />
                  </td>
                )}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={classNames('px-4 py-3 text-sm text-gray-900', col.className)}
                  >
                    {col.render ? col.render(row, rowIndex) : String((row as Record<string, unknown>)[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}