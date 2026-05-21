'use client';

import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { DatePicker, type Color } from './DatePicker';

interface AddTodoFormProps {
  onAdd: (text: string, color: Color, dueDate?: string) => void;
}

const DEFAULT_COLOR: Color = { hex: '#007AFF', name: 'Blue' };

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [color, setColor] = useState<Color>(DEFAULT_COLOR);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), color, dueDate);
      setText('');
      setDueDate(undefined);
      setShowOptions(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      {/* Main input row */}
      <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
        <button
          type="submit"
          disabled={!text.trim()}
          className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-[var(--text-secondary)] hover:border-[var(--accent)] disabled:opacity-30 disabled:hover:border-[var(--text-secondary)] transition-colors flex items-center justify-center"
          aria-label="Add todo"
        >
          <svg className={`w-3 h-3 text-[var(--accent)] transition-opacity ${text.trim() ? 'opacity-100' : 'opacity-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 5v14M5 12h14" />
          </svg>
        </button>

        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowOptions(true)}
          placeholder="New Reminder"
          className="flex-1 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] text-base focus:outline-none"
          style={{ color: 'var(--text-primary)' }}
        />

        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${showOptions ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'}`}
          aria-label="Toggle options"
        >
          <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Expandable options */}
      {showOptions && (
        <div className="mt-3 p-4 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                Color
              </label>
              <ColorPicker selectedColor={color} onColorChange={setColor} />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                Due Date
              </label>
              <DatePicker dueDate={dueDate} onDateChange={setDueDate} />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
