'use client';

import { useState } from 'react';
import type { Color } from './DatePicker';
import { DueDateBadge } from './DatePicker';
import { ColorPicker } from './ColorPicker';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  color: Color;
  dueDate?: string;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: Color) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
}

export function TodoItem({
  id,
  text,
  completed,
  color,
  dueDate,
  onToggle,
  onEdit,
  onDelete,
  onColorChange,
  onDueDateChange,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [showMenu, setShowMenu] = useState(false);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

  return (
    <div
      className={`group relative flex items-center gap-3 py-3 px-2 border-b border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors`}
    >
      {/* Apple-style circle checkbox */}
      <button
        onClick={() => onToggle(id)}
        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 transition-all ${
          completed
            ? 'bg-[var(--accent)] border-[var(--accent)]'
            : 'border-[var(--text-secondary)] hover:border-[var(--accent)]'
        }`}
        aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {completed && (
          <svg className="w-3 h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Todo content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-2 py-1 bg-[var(--bg-secondary)] border border-[var(--accent)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)]"
            autoFocus
          />
        ) : (
          <div className="flex items-center gap-2">
            <p
              className={`text-[15px] ${completed ? 'line-through text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}
              onDoubleClick={() => setIsEditing(true)}
            >
              {text}
            </p>
            {dueDate && <DueDateBadge dueDate={dueDate} />}
          </div>
        )}
      </div>

      {/* Color indicator */}
      <div
        className="flex-shrink-0 w-2 h-2 rounded-full"
        style={{ backgroundColor: color.hex }}
        title={color.name}
      />

      {/* Menu button */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className={`p-1 rounded transition-colors ${showMenu ? 'bg-[var(--bg-tertiary)]' : 'opacity-0 group-hover:opacity-100 hover:bg-[var(--bg-tertiary)]'}`}
          aria-label="Show options"
        >
          <svg className="w-4 h-4 text-[var(--text-secondary)]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {/* Dropdown menu */}
        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 py-1 w-48 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-lg">
              <button
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>

              <div className="px-3 py-2 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Color</p>
                <ColorPicker
                  selectedColor={color}
                  onColorChange={(c) => onColorChange(id, c)}
                  compact
                />
              </div>

              <div className="px-3 py-2 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Due Date</p>
                <input
                  type="date"
                  value={dueDate || ''}
                  onChange={(e) => onDueDateChange(id, e.target.value || undefined)}
                  className="w-full px-2 py-1 text-sm bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)]"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      const today = new Date().toISOString().split('T')[0];
                      onDueDateChange(id, today);
                      setShowMenu(false);
                    }}
                    className="flex-1 px-2 py-1 text-xs bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] rounded transition-colors text-[var(--text-primary)]"
                  >
                    Today
                  </button>
                  {dueDate && (
                    <button
                      onClick={() => {
                        onDueDateChange(id, undefined);
                        setShowMenu(false);
                      }}
                      className="flex-1 px-2 py-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t border-[var(--border-color)]">
                <button
                  onClick={() => {
                    onDelete(id);
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
