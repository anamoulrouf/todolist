'use client';

import { useState } from 'react';
import { ColorPicker } from './ColorPicker';
import { DatePicker, type Color } from './DatePicker';

interface AddTodoFormProps {
  onAdd: (text: string, color: Color, dueDate?: string) => void;
}

const DEFAULT_COLOR: Color = { hex: '#3b82f6', name: 'Blue' };

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('');
  const [color, setColor] = useState<Color>(DEFAULT_COLOR);
  const [dueDate, setDueDate] = useState<string | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), color, dueDate);
      setText('');
      setDueDate(undefined);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.metaKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <div>
        <label htmlFor="todo-input" className="block text-sm font-medium text-gray-700 mb-2">
          Add a new task
        </label>
        <input
          id="todo-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <p className="mt-1 text-xs text-gray-500">Press Cmd+Enter to submit</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <ColorPicker selectedColor={color} onColorChange={setColor} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date (optional)
          </label>
          <DatePicker dueDate={dueDate} onDateChange={setDueDate} />
        </div>
      </div>

      <button
        type="submit"
        disabled={!text.trim()}
        className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Task
      </button>
    </form>
  );
}
