'use client';

import { useState } from 'react';
import { Color, DueDateBadge } from './DatePicker';

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
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const getTransparentColor = (hex: string, opacity: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-4 rounded-lg border-l-4 transition-all ${
        completed ? 'bg-gray-50 opacity-75' : 'bg-white hover:shadow-md'
      }`}
      style={{
        borderLeftColor: completed ? '#9ca3af' : color.hex,
        backgroundColor: completed ? undefined : getTransparentColor(color.hex, 0.05),
      }}
    >
      <button
        onClick={() => onToggle(id)}
        className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 transition-colors ${
          completed
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 hover:border-indigo-500'
        }`}
        aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {completed && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className="w-full px-2 py-1 border border-indigo-500 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
        ) : (
          <p
            className={`text-gray-800 ${completed ? 'line-through text-gray-500' : ''}`}
            onDoubleClick={() => setIsEditing(true)}
          >
            {text}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1 text-sm">
            <span
              className="w-3 h-3 rounded"
              style={{ backgroundColor: color.hex }}
            />
            <span className="text-gray-500">{color.name}</span>
          </div>
          {dueDate && <DueDateBadge dueDate={dueDate} />}
        </div>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Change color"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
        </button>

        <button
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Set due date"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>

        <button
          onClick={() => setIsEditing(true)}
          className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>

        <button
          onClick={() => onDelete(id)}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {showColorPicker && (
        <div className="absolute top-full right-0 mt-2 z-10 p-3 bg-white rounded-lg shadow-lg border border-gray-200 w-64">
          <div className="mb-2 text-sm font-medium text-gray-700">Change Color</div>
          <div className="flex flex-wrap gap-2">
            {['#ef4444', '#f97316', '#f59e0b', '#22c55e', '#14b8a6', '#3b82f6', '#6366f1', '#a855f7', '#ec4899', '#6b7280'].map((hex) => (
              <button
                key={hex}
                onClick={() => {
                  onColorChange(id, { hex, name: color.name });
                  setShowColorPicker(false);
                }}
                className={`w-6 h-6 rounded border-2 transition-transform hover:scale-110 ${
                  color.hex === hex ? 'border-gray-900' : 'border-gray-200'
                }`}
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-gray-200">
            <label className="block text-xs text-gray-600 mb-1">Custom color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => onColorChange(id, { hex: e.target.value, name: color.name })}
                className="w-10 h-8 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color.name}
                onChange={(e) => onColorChange(id, { hex: color.hex, name: e.target.value })}
                placeholder="Color name"
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>
      )}

      {showDatePicker && (
        <div className="absolute top-full right-0 mt-2 z-10 p-3 bg-white rounded-lg shadow-lg border border-gray-200">
          <div className="mb-2 text-sm font-medium text-gray-700">Due Date</div>
          <input
            type="date"
            value={dueDate || ''}
            onChange={(e) => onDueDateChange(id, e.target.value || undefined)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => {
                const today = new Date().toISOString().split('T')[0];
                onDueDateChange(id, today);
                setShowDatePicker(false);
              }}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded"
            >
              Today
            </button>
            <button
              onClick={() => {
                onDueDateChange(id, undefined);
                setShowDatePicker(false);
              }}
              className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
