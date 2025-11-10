import { useState, useEffect } from "react";
import { getColorOptions } from "../constants/zones";

/**
 * Modal for editing existing zone properties (name and color)
 * Shows zone metadata (type, ID)
 * Includes delete button alongside save/cancel actions
 * ESC key closes modal (unless higher-priority modal is open)
 */
export default function ZoneEditModal({ isOpen, zone, onSave, onCancel, onDelete }) {
  const [name, setName] = useState("");
  const [color, setColor] = useState("blue");
  const [error, setError] = useState("");

  const colorOptions = getColorOptions();

  useEffect(() => {
    if (zone) {
      setName(zone.name || "");
      setColor(zone.color || "blue");
      setError("");
    }
  }, [zone]);

  // ESC key handler
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

  const handleDelete = () => onDelete?.(zone);

  if (!isOpen || !zone) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-2000" onClick={handleCancel} />

      {/* Modal container */}
      <div className="fixed inset-0 z-2001 flex items-center justify-center p-4 pointer-events-none">
        {/* Modal content */}
        <div
          className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with zone type and ID */}
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Uredi zonu</h2>
            <p className="text-sm text-gray-600 mt-1">
              {zone.type === "polygon" && "Poligon"}
              {zone.type === "rectangle" && "Pravokutnik"}
              {zone.type === "circle" && "Krug"}
              {" • ID: "}
              {zone.id.substring(0, 8)}...
            </p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            {/* Zone name input */}
            <div>
              <label
                htmlFor="zone-name-edit"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Naziv zone *
              </label>
              <input
                id="zone-name-edit"
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

            {/* Color selection (radio buttons) */}
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
                      name="color-edit"
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
              onClick={handleDelete}
              className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              title="Obriši zonu"
            >
              Obriši
            </button>
            <div className="flex-1 flex gap-3">
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
      </div>
    </>
  );
}
