'use client';

import { Color } from './DatePicker';
import { TodoItem } from './TodoItem';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  color: Color;
  dueDate?: string;
}

type FilterType = 'all' | 'active' | 'completed';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: Color) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
  onClearCompleted: () => void;
}

export function TodoList({
  todos,
  onToggle,
  onEdit,
  onDelete,
  onColorChange,
  onDueDateChange,
  onClearCompleted,
}: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div className="space-y-4">
      {todos.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({todos.length})
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active ({activeCount})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Completed ({completedCount})
            </button>
          </div>

          {completedCount > 0 && (
            <button
              onClick={onClearCompleted}
              className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Clear Completed
            </button>
          )}
        </div>
      )}

      {filteredTodos.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 mx-auto text-gray-300 mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            {filter === 'completed' && 'No completed tasks yet'}
            {filter === 'active' && 'No active tasks'}
            {filter === 'all' && 'No tasks yet. Add one above!'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              id={todo.id}
              text={todo.text}
              completed={todo.completed}
              color={todo.color}
              dueDate={todo.dueDate}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onColorChange={onColorChange}
              onDueDateChange={onDueDateChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
