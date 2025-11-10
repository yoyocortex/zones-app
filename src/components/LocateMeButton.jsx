import { useState, useEffect } from "react";

/**
 * Button to trigger user geolocation with visual feedback
 * Shows different states: idle, loading, success, error, permission denied
 * Auto-hides status feedback after 2 seconds
 */
export default function LocateMeButton({ onLocate, loading, success, error, permissionDenied }) {
  const [showStatus, setShowStatus] = useState(false);

  // Show status feedback temporarily when success or error changes
  useEffect(() => {
    if (success || error) {
      setShowStatus(true);
      const timer = setTimeout(() => setShowStatus(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  const handleClick = () => {
    if (loading || permissionDenied) return;
    onLocate?.();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading || permissionDenied}
      className={`
        absolute bottom-24 right-4 z-1000
        w-12 h-12 rounded-full shadow-lg
        flex items-center justify-center
        transition-colors duration-200
        ${
          permissionDenied
            ? "bg-gray-200 cursor-not-allowed"
            : showStatus && success
              ? "bg-green-500"
              : showStatus && error
                ? "bg-red-500"
                : loading
                  ? "bg-gray-300 cursor-wait"
                  : "bg-white hover:bg-gray-50 cursor-pointer"
        }
      `}
      title={
        permissionDenied
          ? "Dozvola odbijena - omogući u postavkama browsera"
          : showStatus && success
            ? "Lokacija pronađena"
            : showStatus && error
              ? "Greška"
              : loading
                ? "Tražim..."
                : "Pronađi lokaciju"
      }
      aria-label="Pronađi lokaciju"
    >
      {loading ? (
        <div className="animate-spin w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full" />
      ) : showStatus && success ? (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      ) : showStatus && error ? (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : permissionDenied ? (
        <svg
          className="w-5 h-5 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M4 4l16 16"
            className="text-red-500"
          />
        </svg>
      ) : (
        <svg
          className="w-5 h-5 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      )}
    </button>
  );
}
