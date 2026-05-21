'use client';

import { useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useDarkMode } from '@/hooks/useDarkMode';
import { AddTodoForm } from '@/components/AddTodoForm';
import { TodoList, Todo } from '@/components/TodoList';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { Color } from '@/components/DatePicker';
import { exportTodos, importTodos } from '@/lib/backup';

export default function Home() {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>('todos', []);
  const { isDark, toggle: toggleDarkMode } = useDarkMode();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const addTodo = (text: string, color: Color, dueDate?: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
      color,
      dueDate,
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const editTodo = (id: string, text: string) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, text } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const updateColor = (id: string, color: Color) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, color } : todo
    ));
  };

  const updateDueDate = (id: string, dueDate: string | undefined) => {
    setTodos(todos.map((todo) =>
      todo.id === id ? { ...todo, dueDate } : todo
    ));
  };

  const clearCompleted = () => {
    setTodos(todos.filter((todo) => !todo.completed));
  };

  const handleExport = () => {
    exportTodos(todos);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const importedTodos = await importTodos(file);
      setTodos(importedTodos);
      setImportError(null);
    } catch (err) {
      setImportError('Failed to import todos. Please check the file format.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const activeCount = todos.filter((t) => !t.completed).length;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-semibold text-[var(--text-primary)]">
              Reminders
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {activeCount} {activeCount === 1 ? 'reminder' : 'reminders'} remaining
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Export button */}
            <button
              onClick={handleExport}
              className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Export todos"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>

            {/* Import button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-[var(--bg-tertiary)] transition-colors"
              title="Import todos"
            >
              <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />

            {/* Dark mode toggle */}
            <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
          </div>
        </header>

        {/* Import error */}
        {importError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-500">{importError}</p>
          </div>
        )}

        {/* Loading state */}
        {!isLoaded ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--accent)]"></div>
          </div>
        ) : (
          <>
            {/* Add todo form */}
            <AddTodoForm onAdd={addTodo} />

            {/* Todo list */}
            <div className="mt-6">
              <TodoList
                todos={todos}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={deleteTodo}
                onColorChange={updateColor}
                onDueDateChange={updateDueDate}
                onClearCompleted={clearCompleted}
              />
            </div>
          </>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-[var(--text-secondary)]">
            Data stored locally in your browser • Use Export to backup
          </p>
        </footer>
      </div>
    </div>
  );
}
