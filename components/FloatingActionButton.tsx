'use client';

import { forwardRef } from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
  ariaLabel?: string;
  isOpen?: boolean;
}

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
  function FloatingActionButton(
    { onClick, ariaLabel = 'Create new reminder', isOpen = false },
    ref
  ) {
    return (
      <button
        ref={ref}
        onClick={onClick}
        aria-label={ariaLabel}
        aria-expanded={isOpen}
        className={`
          fixed bottom-6 left-1/2 -translate-x-1/2 z-40
          w-14 h-14 rounded-full
          bg-[var(--accent)] hover:bg-[var(--accent-hover)]
          text-white shadow-lg hover:shadow-xl
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-4 focus:ring-[var(--accent)]/30
          active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
          ${isOpen ? 'scale-90' : 'scale-100'}
        `}
        style={{
          transitionProperty: 'transform, background-color, box-shadow',
          willChange: 'transform'
        }}
      >
        {/* Plus icon */}
        <svg
          className="w-6 h-6 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>

        {/* Visual feedback for reduced motion */}
        <style jsx>{`
          @media (prefers-reduced-motion: reduce) {
            button {
              transition: none !important;
            }
          }
        `}</style>
      </button>
    );
  }
);