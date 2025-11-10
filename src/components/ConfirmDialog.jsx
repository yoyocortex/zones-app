import { useEffect } from "react";

/**
 * Reusable confirmation dialog component
 * Supports different variants (danger, warning, info)
 * Uses z-index 2500+ to appear above all modals
 * Handles ESC key
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Potvrdi",
  cancelText = "Odustani",
  onConfirm,
  onCancel,
  variant = "danger", // "danger" | "warning" | "info"
}) {
  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onCancel();
      }
    };

    // Use capture phase (true) to catch ESC first
    window.addEventListener("keydown", handleEscape, true);
    return () => window.removeEventListener("keydown", handleEscape, true);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  // Variant-specific styling and icons
  const variantStyles = {
    danger: {
      button: "bg-red-600 hover:bg-red-700 text-white",
      icon: (
        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    warning: {
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
      icon: (
        <svg
          className="w-6 h-6 text-yellow-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      ),
    },
    info: {
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      icon: (
        <svg
          className="w-6 h-6 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const style = variantStyles[variant];

  return (
    <>
      {/* Backdrop with blur - highest z-index to cover all other modals */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-2500" onClick={onCancel} />

      {/* Modal content - above backdrop */}
      <div className="fixed inset-0 z-2501 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Icon + Title + Message */}
          <div className="flex items-start gap-4 mb-4">
            <div className="shrink-0">{style.icon}</div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 mt-2">{message}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-2 rounded-lg transition-colors font-medium ${style.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
