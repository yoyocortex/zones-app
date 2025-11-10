import { useState, useEffect } from "react";
import { getColorOptions } from "../constants/zones";

/**
 * Modal for creating a new zone
 * Collects zone name and color from user
 * Shows zone type (polygon/rectangle/circle)
 * ESC key closes modal
 */
export default function ZoneModal({ isOpen, zoneType, onSave, onCancel }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [error, setError] = useState("");

  const colorOptions = getColorOptions();

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        if (!e.defaultPrevented) handleCancel();
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!name.trim()) {
      setError("Naziv zone je obavezan");
      return;
    }

    onSave({ name: name.trim(), color });

    setName("");
    setColor("blue");
    setError("");
  };

  const handleCancel = () => {
    setName("");
    setColor("blue");
    setError("");
    onCancel();
  };

  if (!isOpen) return null;

  const typeLabel =
    zoneType === "polygon" ? "Poligon" : zoneType === "rectangle" ? "Pravokutnik" : "Krug";

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-2000" onClick={handleCancel} />

      <div className="fixed inset-0 z-2001 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nova zona</h2>
            <p className="text-sm text-gray-600 mt-1">Tip: {typeLabel}</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Zone name input */}
            <div>
              <label htmlFor="zone-name" className="block text-sm font-medium text-gray-700 mb-1">
                Naziv zone *
              </label>
              <input
                id="zone-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder="npr. Parking zona A"
                className={`
                  w-full px-3 py-2 border rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  ${error ? "border-red-500" : "border-gray-300"}
                `}
                autoFocus
              />
              {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            </div>

            {/* Color selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Boja *</label>
              <div className="space-y-2">
                {colorOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="color"
                      value={option.value}
                      checked={color === option.value}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-gray-300"
                      style={{ backgroundColor: option.hex }}
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Odustani
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Spremi
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
