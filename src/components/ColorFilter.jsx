import { useState, useEffect } from "react";
import { getColorOptions } from "../constants/zones";

/**
 * Color filter component for filtering zones by color
 * Persists selected colors to localStorage
 * Responsive: horizontal on desktop, vertical on mobile
 */
export default function ColorFilter({ onFilterChange }) {
  // Load saved color filters from localStorage or use all colors as default
  const [selectedColors, setSelectedColors] = useState(() => {
    const saved = localStorage.getItem("colorFilter");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return ["red", "blue", "green", "yellow", "purple"];
      }
    }
    return ["red", "blue", "green", "yellow", "purple"];
  });

  const colorOptions = getColorOptions();

  // Save to localStorage and notify parent whenever selection changes
  useEffect(() => {
    localStorage.setItem("colorFilter", JSON.stringify(selectedColors));
    onFilterChange?.(selectedColors);
  }, [selectedColors, onFilterChange]);

  // Toggle individual color selection
  const toggleColor = (colorValue) => {
    setSelectedColors((prev) => {
      if (prev.includes(colorValue)) {
        return prev.filter((c) => c !== colorValue);
      } else {
        return [...prev, colorValue];
      }
    });
  };

  // Toggle all colors on/off
  const toggleAll = () => {
    if (selectedColors.length === 5) {
      setSelectedColors([]);
    } else {
      setSelectedColors(["red", "blue", "green", "yellow", "purple"]);
    }
  };

  const allSelected = selectedColors.length === 5;

  return (
    <div className="absolute top-4 right-4 z-1002 bg-white rounded-lg shadow-lg p-2.5">
      {/* Responsive layout: horizontal (desktop) / vertical (mobile) */}
      <div className="flex md:flex-row flex-col items-center md:gap-4 gap-2">
        {/* Active filters counter */}
        <span className="text-xs font-medium text-gray-700 md:mr-0.5">
          {selectedColors.length}/5
        </span>

        {/* Color filter buttons */}
        {colorOptions.map((option) => {
          const isSelected = selectedColors.includes(option.value);

          return (
            <button
              key={option.value}
              onClick={() => toggleColor(option.value)}
              className={`
                relative w-6 h-6 rounded-full transition-all duration-200
                ${
                  isSelected
                    ? "ring-2 ring-offset-1 ring-gray-600 scale-105"
                    : "opacity-40 hover:opacity-70 grayscale hover:grayscale-0"
                }
              `}
              style={{ backgroundColor: option.hex }}
              title={`${option.label} - ${isSelected ? "Sakrij" : "Prikaži"}`}
              aria-label={`Filter ${option.label}`}
            >
              {/* Checkmark for selected colors */}
              {isSelected && (
                <svg
                  className="absolute inset-0 m-auto w-3 h-3 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={4}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </button>
          );
        })}

        {/* Divider - rotates from vertical to horizontal on mobile */}
        <div className="md:w-px md:h-5 w-5 h-px bg-gray-300 md:mx-0.5" />

        {/* Toggle all button */}
        <button
          onClick={toggleAll}
          className={`
            px-1 py-1 text-xs font-medium rounded-lg transition-colors
            ${
              allSelected
                ? "bg-red-600 text-white hover:bg-red-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
          title={allSelected ? "Deselektiraj sve" : "Odaberi sve"}
        >
          {allSelected ? (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
