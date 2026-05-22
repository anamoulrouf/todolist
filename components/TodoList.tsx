'use client';

import { useState, useMemo } from 'react';
import type { Color } from './DatePicker';
import { TodoItem } from './TodoItem';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  color: Color;
  dueDate?: string;
  description?: string;
  starred?: boolean;
}

type FilterType = 'all' | 'active' | 'completed';
type SortOption = 'dueDate-asc' | 'dueDate-desc' | 'created-desc' | 'created-asc' | 'color';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: Color) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
  onClearCompleted: () => void;
  onColorSelect?: (color: Color) => void;
  onStarToggle?: (id: string) => void;
  onDescriptionChange?: (id: string, description: string) => void;
  recentColors?: Color[];
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'dueDate-asc', label: 'Due Date ↑' },
  { value: 'dueDate-desc', label: 'Due Date ↓' },
  { value: 'created-desc', label: 'Newest First' },
  { value: 'created-asc', label: 'Oldest First' },
  { value: 'color', label: 'Color' },
];

export function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onColorChange,
  onDueDateChange,
  onClearCompleted,
  onColorSelect,
  onStarToggle,
  onDescriptionChange,
  recentColors = [],
}: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortOption>('created-desc');

  // Filter and sort todos
  const processedTodos = useMemo(() => {
    let filtered = todos;

    // Apply filter
    if (filter === 'active') {
      filtered = filtered.filter((t) => !t.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((t) => t.completed);
    }

    // Apply sort
    const sorted = [...filtered];
    switch (sortBy) {
      case 'dueDate-asc':
        sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case 'dueDate-desc':
        sorted.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        });
        break;
      case 'created-desc':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'created-asc':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'color':
        sorted.sort((a, b) => a.color.name.localeCompare(b.color.name));
        break;
    }

    return sorted;
  }, [todos, filter, sortBy]);

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between">
          {/* Apple-style segmented control */}
          <div className="inline-flex p-1 bg-[var(--bg-tertiary)] rounded-lg">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === 'active'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                filter === 'completed'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              Completed
            </button>
          </div>

          {/* Sort dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-3 py-1.5 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)]"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Empty state */}
      {processedTodos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[var(--text-secondary)]">
            {filter === 'completed' && 'No completed tasks'}
            {filter === 'active' && 'No active tasks'}
            {filter === 'all' && 'No reminders yet'}
          </p>
        </div>
      ) : (
        /* Todo list */
        <div className="bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
          <div className="divide-y divide-[var(--border-color)]">
            {processedTodos.map((todo, index) => (
              <TodoItem
                key={todo.id}
                id={todo.id}
                text={todo.text}
                completed={todo.completed}
                color={todo.color}
                dueDate={todo.dueDate}
                description={todo.description}
                starred={todo.starred}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
                onColorChange={onColorChange}
                onDueDateChange={onDueDateChange}
                onColorSelect={onColorSelect}
                onStarToggle={onStarToggle}
                onDescriptionChange={onDescriptionChange}
                recentColors={recentColors}
              />
            ))}
          </div>
        </div>
      )}

      {/* Footer actions */}
      {completedCount > 0 && (
        <div className="flex justify-center">
          <button
            onClick={onClearCompleted}
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Clear {completedCount} completed
          </button>
        </div>
      )}
    </div>
  );
}
