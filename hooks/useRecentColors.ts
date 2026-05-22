'use client';

import { useState, useEffect } from 'react';
import type { Color } from '@/components/DatePicker';

const RECENT_COLORS_KEY = 'todo-recent-colors';
const MAX_RECENT_COLORS = 5;

export function useRecentColors() {
  const [recentColors, setRecentColors] = useState<Color[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_COLORS_KEY);
      if (stored) {
        const colors = JSON.parse(stored);
        // Filter out invalid colors and remove duplicates
        const validColors = colors
          .filter((color: any) => color && color.hex && color.name)
          .filter((color: any, index: number, self: any[]) =>
            index === self.findIndex((c: any) => c.hex === color.hex)
          );
        setRecentColors(validColors.slice(0, MAX_RECENT_COLORS));
      }
    } catch (error) {
      console.error('Error loading recent colors:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const addColor = (color: Color) => {
    setRecentColors(prev => {
      // Remove if already exists to avoid duplicates
      const filtered = prev.filter(c => c.hex !== color.hex);
      // Add to beginning and limit to max colors
      const updated = [color, ...filtered].slice(0, MAX_RECENT_COLORS);

      // Persist to localStorage
      try {
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Error saving recent colors:', error);
      }

      return updated;
    });
  };

  return { recentColors, addColor, isLoaded };
}