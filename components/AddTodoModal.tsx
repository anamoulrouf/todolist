'use client';

import { useState, useEffect, useRef } from 'react';
import { ColorPicker } from './ColorPicker';
import { DatePicker, type Color } from './DatePicker';
import { useFocusTrap } from '@/hooks/useFocusTrap';

interface AddTodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (text: string, color: Color, dueDate?: string, description?: string, starred?: boolean) => void;
  onColorSelect?: (color: Color) => void;
  triggerRef?: React.RefObject<HTMLButtonElement | null>;
}

const DEFAULT_COLOR: Color = { hex: '#007AFF', name: 'Blue' };

export function AddTodoModal({
  isOpen,
  onClose,
  onAdd,
  onColorSelect,
  triggerRef
}: AddTodoModalProps) {
  const [text, setText] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<Color>(DEFAULT_COLOR);
  const [dueDate, setDueDate] = useState<string | undefined>();
  const [starred, setStarred] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset form state when modal opens
      setText('');
      setDescription('');
      setColor(DEFAULT_COLOR);
      setDueDate(undefined);
      setStarred(false);
      setShowOptions(true); // Always show options in modal
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), color, dueDate, description.trim() || undefined, starred);
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    setDescription('');
    setColor(DEFAULT_COLOR);
    setDueDate(undefined);
    setStarred(false);
    setShowOptions(false);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  // Use focus trap for accessibility
  const modalRef = useFocusTrap(isOpen, triggerRef);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        className="relative bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-color)] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] px-6 py-4 rounded-t-2xl z-10">
          <h2
            id="modal-title"
            className="text-xl font-semibold text-[var(--text-primary)]"
          >
            New Reminder
          </h2>
          <p
            id="modal-description"
            className="text-sm text-[var(--text-secondary)] mt-1"
          >
            Create a new reminder with details
          </p>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Main todo input */}
          <div>
            <label htmlFor="todo-text" className="sr-only">
              Reminder title
            </label>
            <input
              id="todo-text"
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What do you need to remember?"
              className="w-full px-4 py-3 text-lg bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all"
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="todo-description" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Description <span className="text-xs opacity-75">(optional)</span>
            </label>
            <textarea
              id="todo-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details..."
              rows={3}
              className="w-full px-4 py-3 text-base bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent transition-all resize-none"
            />
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="todo-duedate" className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Due Date <span className="text-xs opacity-75">(optional)</span>
            </label>
            <div className="p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl">
              <DatePicker
                dueDate={dueDate}
                onDateChange={setDueDate}
                showTodayButton={!dueDate}
              />
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Color
            </label>
            <div className="p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl">
              <ColorPicker
                selectedColor={color}
                onColorChange={setColor}
                onColorSelect={onColorSelect}
              />
            </div>
          </div>

          {/* Star Toggle */}
          <div className="flex items-center gap-3 p-3 bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded-xl">
            <button
              type="button"
              onClick={() => setStarred(!starred)}
              className={`
                flex-shrink-0 p-2 rounded-lg transition-all
                ${starred ? 'bg-yellow-500/20' : 'hover:bg-[var(--bg-secondary)]'}
              `}
              aria-pressed={starred}
              aria-label="Mark as important"
            >
              <svg
                className={`w-5 h-5 transition-colors ${starred ? 'text-yellow-500' : 'text-[var(--text-secondary)]'}`}
                fill={starred ? 'currentColor' : 'none'}
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </button>
            <div className="flex-1">
              <span className="text-sm text-[var(--text-primary)]">
                {starred ? 'Marked as important' : 'Mark as important'}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-[var(--border-color)]">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3 text-base bg-[var(--bg-tertiary)] hover:bg-[var(--border-color)] text-[var(--text-primary)] rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!text.trim()}
              className="flex-1 px-6 py-3 text-base bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white rounded-xl transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Reminder
            </button>
          </div>
        </form>

        {/* Reduced motion support */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            * {
              transition: none !important;
              animation: none !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
}