'use client';

import { useState } from 'react';
import type { Color } from './DatePicker';
import { DueDateBadge } from './DatePicker';
import { ColorPicker } from './ColorPicker';
import { ConfirmModal } from './ConfirmModal';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  color: Color;
  dueDate?: string;
  description?: string;
  starred?: boolean;
  onToggle: (id: string) => void;
  onEdit: (id: string, text: string) => void;
  onDelete: (id: string) => void;
  onColorChange: (id: string, color: Color) => void;
  onDueDateChange: (id: string, dueDate: string | undefined) => void;
  onColorSelect?: (color: Color) => void;
  onStarToggle?: (id: string) => void;
  onDescriptionChange?: (id: string, description: string) => void;
  recentColors?: Color[];
}

export function TodoItem({
  id,
  text,
  completed,
  color,
  dueDate,
  description,
  starred,
  onToggle,
  onEdit,
  onDelete,
  onColorChange,
  onDueDateChange,
  onColorSelect,
  onStarToggle,
  onDescriptionChange,
  recentColors = [],
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editText, setEditText] = useState(text);
  const [editDescription, setEditDescription] = useState(description || '');
  const [showMenu, setShowMenu] = useState(false);

  const shortenText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const confirmDelete = () => {
    onDelete(id);
    setShowDeleteModal(false);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleSaveDescription = () => {
    onDescriptionChange?.(id, editDescription.trim());
    setIsEditingDescription(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const handleDescriptionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveDescription();
    } else if (e.key === 'Escape') {
      setEditDescription(description || '');
      setIsEditingDescription(false);
    }
  };

  const isOverdue = dueDate && new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();

  return (
    <div
      className={`group relative py-3 px-2 hover:bg-[var(--bg-tertiary)] transition-colors ${starred ? 'bg-yellow-500/5' : ''}`}
    >
      {/* Row 1: Task info + controls */}
      <div className="flex items-center gap-3">
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

        {/* Left side: Star + Task name + Due date */}
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {/* Star icon (always visible, filled/outline based on state) */}
          <button
            onClick={() => onStarToggle?.(id)}
            className="flex-shrink-0"
            aria-label={starred ? 'Unstar' : 'Star'}
          >
            <svg
              className={`w-4 h-4 ${starred ? 'text-yellow-500' : 'text-[var(--text-secondary)]'}`}
              fill={starred ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </button>

          {/* Task name */}
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
        </div>

        {/* Right side: Color dot + More button */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Color indicator */}
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: color.hex }}
            title={color.name}
          />

          {/* Menu button */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className={`p-1 rounded transition-colors ${showMenu ? 'bg-[var(--bg-tertiary)]' : 'hover:bg-[var(--bg-tertiary)]'}`}
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

              <button
                onClick={() => {
                  setIsEditingDescription(true);
                  setEditDescription(description || '');
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                </svg>
                Edit Description
              </button>

              <button
                onClick={() => {
                  onStarToggle?.(id);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] flex items-center gap-2"
              >
                <svg className={`w-4 h-4 ${starred ? 'text-yellow-500' : ''}`} fill={starred ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {starred ? 'Unstar' : 'Star'}
              </button>

              <div className="px-3 py-2 border-t border-[var(--border-color)]">
                <p className="text-xs text-[var(--text-secondary)] mb-2">Color</p>
                <ColorPicker
                  selectedColor={color}
                  onColorChange={(c) => onColorChange(id, c)}
                  onColorSelect={onColorSelect}
                  compact
                  recentColors={recentColors}
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
                  {!dueDate && (
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
                  )}
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
                  onClick={handleDelete}
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
      </div>

      {/* Row 2: Description (expandable) */}
      {(description || isEditingDescription) && (
        <div className="ml-8 mr-4 mt-1">
          {isEditingDescription ? (
            <input
              type="text"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              onKeyDown={handleDescriptionKeyDown}
              onBlur={handleSaveDescription}
              className="w-full px-2 py-1 text-xs bg-[var(--bg-secondary)] border border-[var(--accent)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)]"
              placeholder="Add description..."
              autoFocus
            />
          ) : description && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              onDoubleClick={() => {
                setIsEditingDescription(true);
                setEditDescription(description || '');
                setIsExpanded(true);
              }}
              className="text-xs text-[var(--text-secondary)] text-left hover:text-[var(--text-primary)] transition-colors w-full text-left"
            >
              {isExpanded ? description : shortenText(description, 80)}
            </button>
          )}
        </div>
      )}

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        title="Delete Reminder"
        message={`Are you sure you want to delete "${text}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setShowDeleteModal(false)}
      />
    </div>
  );
}
