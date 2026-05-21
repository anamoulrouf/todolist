'use client';

import { useState, useEffect } from 'react';
import type { Color } from './DatePicker';

const APPLE_COLORS: Color[] = [
  { name: 'Red', hex: '#FF3B30' },
  { name: 'Orange', hex: '#FF9500' },
  { name: 'Yellow', hex: '#FFCC00' },
  { name: 'Green', hex: '#34C759' },
  { name: 'Teal', hex: '#5AC8FA' },
  { name: 'Blue', hex: '#007AFF' },
  { name: 'Indigo', hex: '#5856D6' },
  { name: 'Purple', hex: '#AF52DE' },
  { name: 'Pink', hex: '#FF2D55' },
  { name: 'Gray', hex: '#8E8E93' },
];

interface ColorPickerProps {
  selectedColor: Color;
  onColorChange: (color: Color) => void;
  compact?: boolean;
}

export function ColorPicker({ selectedColor, onColorChange, compact = false }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState('#007AFF');
  const [colorName, setColorName] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  useEffect(() => {
    if (!APPLE_COLORS.find(c => c.hex === selectedColor.hex)) {
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
    <div className={compact ? '' : 'space-y-3'}>
      <div className={`flex ${compact ? 'gap-1.5' : 'flex-wrap gap-2'}`}>
        {APPLE_COLORS.map((color) => (
          <button
            key={color.hex}
            onClick={() => handlePredefinedClick(color)}
            className={`transition-transform hover:scale-110 ${
              selectedColor.hex === color.hex && !showCustom
                ? 'ring-2 ring-offset-2 ring-[var(--accent)]'
                : ''
            }`}
            style={{
              width: compact ? '20px' : '28px',
              height: compact ? '20px' : '28px',
              borderRadius: '50%',
              backgroundColor: color.hex,
            }}
            title={color.name}
            aria-label={`Select ${color.name}`}
          />
        ))}
        <button
          onClick={useCustomColor}
          className={`flex items-center justify-center transition-transform hover:scale-110 ${
            showCustom ? 'ring-2 ring-offset-2 ring-[var(--accent)]' : ''
          }`}
          style={{
            width: compact ? '20px' : '28px',
            height: compact ? '20px' : '28px',
            borderRadius: '50%',
            backgroundColor: customColor,
          }}
          title="Custom color"
          aria-label="Select custom color"
        >
          <svg className={`text-white ${compact ? 'w-3 h-3' : 'w-4 h-4'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>

      {showCustom && !compact && (
        <div className="flex items-center gap-2 p-2 bg-[var(--bg-tertiary)] rounded-lg">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-8 h-8 rounded cursor-pointer border-0"
            aria-label="Choose custom color"
          />
          <input
            type="text"
            value={colorName}
            onChange={handleColorNameChange}
            placeholder="Color name"
            className="flex-1 px-2 py-1 text-sm bg-transparent border border-[var(--border-color)] rounded focus:outline-none focus:ring-1 focus:ring-[var(--accent)] text-[var(--text-primary)]"
            aria-label="Color name"
          />
        </div>
      )}
    </div>
  );
}
