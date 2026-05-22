'use client';

import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { DatePicker, type Color } from './DatePicker';

interface AddTodoFormProps {
  onAdd: (text: string, color: Color, dueDate?: string, description?: string, starred?: boolean) => void;
  onColorSelect?: (color: Color) => void;
}

const DEFAULT_COLOR: Color = { hex: '#007AFF', name: 'Blue' };

export function AddTodoForm({ onAdd, onColorSelect }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<Color>(DEFAULT_COLOR);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [starred, setStarred] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), color, dueDate, description.trim() || undefined, starred);
      setText('');
      setDescription('');
      setDueDate(undefined);
      setStarred(false);
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
      </div>

      {/* Expandable options */}
      {showOptions && (
        <div className="mt-3 space-y-3 animate-in slide-in-from-top-2">
          {/* Description input */}
          <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>

          {/* Due date and color row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Due date */}
            <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                Due Date
              </label>
              <DatePicker
                dueDate={dueDate}
                onDateChange={setDueDate}
                showTodayButton={!dueDate}
              />
            </div>

            {/* Color */}
            <div className="p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
              <label className="block text-xs font-medium text-[var(--text-secondary)] mb-2">
                Color
              </label>
              <ColorPicker
                selectedColor={color}
                onColorChange={setColor}
                onColorSelect={onColorSelect}
              />
            </div>
          </div>

          {/* Star toggle */}
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-sm">
            <button
              type="button"
              onClick={() => setStarred(!starred)}
              className={`flex-shrink-0 p-2 rounded-lg transition-colors ${starred ? 'bg-yellow-500/10' : 'hover:bg-[var(--bg-tertiary)]'}`}
              aria-label="Mark as important"
            >
              <svg className={`w-5 h-5 ${starred ? 'text-yellow-500' : 'text-[var(--text-secondary)]'}`} fill={starred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
            <span className="text-sm text-[var(--text-secondary)]">
              {starred ? 'Marked as important' : 'Mark as important'}
            </span>
          </div>
        </div>
      )}
    </form>
  );
}
