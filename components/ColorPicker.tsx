'use client';

import { useState, useEffect } from 'react';
import type { Color } from './DatePicker';

const PREDEFINED_COLORS: Color[] = [
  { name: 'Red', hex: '#ef4444' },
  { name: 'Orange', hex: '#f97316' },
  { name: 'Amber', hex: '#f59e0b' },
  { name: 'Green', hex: '#22c55e' },
  { name: 'Teal', hex: '#14b8a6' },
  { name: 'Blue', hex: '#3b82f6' },
  { name: 'Indigo', hex: '#6366f1' },
  { name: 'Purple', hex: '#a855f7' },
  { name: 'Pink', hex: '#ec4899' },
  { name: 'Gray', hex: '#6b7280' },
];

interface ColorPickerProps {
  selectedColor: Color;
  onColorChange: (color: Color) => void;
}

export function ColorPicker({ selectedColor, onColorChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState('#3b82f6');
  const [colorName, setColorName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!PREDEFINED_COLORS.find(c => c.hex === selectedColor.hex)) {
      setCustomColor(selectedColor.hex);
      setColorName(selectedColor.name);
      setShowCustom(true);
    }
  }, [selectedColor]);

  const handlePredefinedClick = (color: Color) => {
    setShowCustom(false);
    onColorChange(color);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColor(hex);
    if (colorName.trim()) {
      onColorChange({ hex, name: colorName.trim() });
    }
  };

  const handleColorNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setColorName(name);
    onColorChange({ hex: customColor, name: name.trim() || customColor });
  };

  const useCustomColor = () => {
    setShowCustom(true);
    onColorChange({ hex: customColor, name: colorName.trim() || 'Custom' });
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PREDEFINED_COLORS.map((color) => (
          <button
            key={color.hex}
            onClick={() => handlePredefinedClick(color)}
            className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
              selectedColor.hex === color.hex && !showCustom
                ? 'border-gray-900 ring-2 ring-gray-300'
                : 'border-gray-200'
            }`}
            style={{ backgroundColor: color.hex }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          />
        ))}
        <button
          onClick={useCustomColor}
          className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 flex items-center justify-center ${
            showCustom ? 'border-gray-900 ring-2 ring-gray-300' : 'border-gray-200'
          }`}
          style={{ backgroundColor: customColor }}
          title="Custom color"
          aria-label="Select custom color"
        >
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showCustom && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-10 h-10 rounded cursor-pointer border-0"
            aria-label="Choose custom color"
          />
          <input
            type="text"
            value={colorName}
            onChange={handleColorNameChange}
            placeholder="Color name (e.g., Work Urgent)"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Color name"
          />
        </div>
      )}

      {selectedColor.name && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span
            className="w-4 h-4 rounded"
            style={{ backgroundColor: selectedColor.hex }}
          />
          <span>{selectedColor.name}</span>
        </div>
      )}
    </div>
  );
}
