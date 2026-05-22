'use client';

import { useEffect, useRef } from 'react';

/**
 * Hook to trap focus within a container element (typically a modal)
 * Ensures keyboard navigation stays within the modal and returns focus to trigger on close
 */
export function useFocusTrap(isActive: boolean, triggerRef?: React.RefObject<HTMLElement | null>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    // Focus the first element when modal opens
    if (firstFocusable) {
      // Small delay to ensure transition has started
      setTimeout(() => firstFocusable.focus(), 50);
    }

    // Handle Tab key navigation
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      // If shift + tab on first element, move to last
      if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
      // If tab on last element, move to first
      else if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    };

    // Handle Escape key
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Return focus to trigger element
        if (triggerRef?.current) {
          triggerRef.current.focus();
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleTabKey);
    document.addEventListener('keydown', handleEscapeKey);

    // Return focus to trigger when modal closes
    return () => {
      document.removeEventListener('keydown', handleTabKey);
      document.removeEventListener('keydown', handleEscapeKey);

      if (triggerRef?.current) {
        triggerRef.current.focus();
      }
    };
  }, [isActive, triggerRef]);

  return containerRef;
}