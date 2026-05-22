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
  onColorSelect?: (color: Color) => void;
  compact?: boolean;
  recentColors?: Color[];
}

export function ColorPicker({
  selectedColor,
  onColorChange,
  onColorSelect,
  compact = false,
  recentColors = []
}: ColorPickerProps) {
  const [customColor, setCustomColor] = useState('#007AFF');
  const [colorName, setColorName] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [showColorPopup, setShowColorPopup] = useState(false);

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
    onColorSelect?.(color);
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
      {compact ? (
        /* Compact mode: Show only recent colors (or fallback to first 5 Apple colors) + add button */
        <div className="relative">
          <div className="flex gap-1.5 items-center">
            {(recentColors.length > 0 ? recentColors : APPLE_COLORS.slice(0, 5)).map((color) => (
              <button
                key={color.hex}
                onClick={() => handlePredefinedClick(color)}
                className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${
                  selectedColor.hex === color.hex && !showCustom
                    ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110'
                    : ''
                }`}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  backgroundColor: color.hex,
                }}
                title={color.name}
                aria-label={`Select ${color.name}`}
              />
            ))}

            {/* Add button for more colors */}
            <button
              onClick={() => setShowColorPopup(!showColorPopup)}
              className={`flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 ${
                showColorPopup ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-105' : ''
              }`}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: 'var(--bg-tertiary)',
                border: '1px dashed var(--text-secondary)',
              }}
              title="More colors"
              aria-label="More colors"
            >
              <svg className="w-3 h-3 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Color popup */}
          {showColorPopup && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowColorPopup(false)}
              />

              {/* Popup content */}
              <div className="absolute left-0 top-full mt-2 z-50 p-3 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border-color)] shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
                <p className="text-xs text-[var(--text-secondary)] mb-2">All Colors</p>
                <div className="flex flex-wrap gap-2" style={{ maxWidth: '200px' }}>
                  {APPLE_COLORS.map((color) => (
                    <button
                      key={color.hex}
                      onClick={() => {
                        handlePredefinedClick(color);
                        setShowColorPopup(false);
                      }}
                      className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${
                        selectedColor.hex === color.hex && !showCustom
                          ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110'
                          : ''
                      }`}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                      }}
                      title={color.name}
                      aria-label={`Select ${color.name}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        /* Full mode: Show recent colors section + all Apple colors */
        <>
          {/* Recent colors section */}
          {recentColors.length > 0 && (
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-2">Recent Colors</p>
              <div className="flex flex-wrap gap-2">
                {recentColors.map((color) => (
                  <button
                    key={color.hex}
                    onClick={() => handlePredefinedClick(color)}
                    className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${
                      selectedColor.hex === color.hex && !showCustom
                        ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110'
                        : ''
                    }`}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: color.hex,
                    }}
                    title={color.name}
                    aria-label={`Select ${color.name}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* All colors section */}
          <div>
            <p className="text-xs text-[var(--text-secondary)] mb-2">
              {recentColors.length > 0 ? 'All Colors' : 'Colors'}
            </p>
            <div className="flex flex-wrap gap-2">
              {APPLE_COLORS.map((color) => (
                <button
                  key={color.hex}
                  onClick={() => handlePredefinedClick(color)}
                  className={`transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${
                    selectedColor.hex === color.hex && !showCustom
                      ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110'
                      : ''
                  }`}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: color.hex,
                  }}
                  title={color.name}
                  aria-label={`Select ${color.name}`}
                />
              ))}
              <button
                onClick={useCustomColor}
                className={`flex items-center justify-center transition-all duration-200 ease-out hover:scale-110 active:scale-95 ${
                  showCustom ? 'ring-2 ring-offset-2 ring-[var(--accent)] scale-110' : ''
                }`}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: customColor,
                }}
                title="Custom color"
                aria-label="Select custom color"
              >
                <svg className="text-white w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

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
