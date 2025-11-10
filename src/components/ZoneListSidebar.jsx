import { useState, useMemo } from "react";
import ZoneListItem from "./ZoneListItem";

/**
 * Sidebar component displaying list of all zones
 * - Responsive width
 * - Search zones by name
 * - Sort by date or name
 * - Slide from right animation
 * - Click zone to center map on it
 */
export default function ZoneListSidebar({ zones, onZoneClick, isOpen, onToggle }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date"); // "date" | "name"

  // Filter and sort zones based on search query and sort preference
  const filteredZones = useMemo(() => {
    let result = [...zones];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((zone) => zone.name.toLowerCase().includes(query));
    }

    // Sort by selected criteria
    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by date (newest first)
      result.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB - dateA;
      });
    }

    return result;
  }, [zones, searchQuery, sortBy]);

  return (
    <>
      {/* Sidebar panel */}
      <div
        className={`
          fixed top-0 right-0 h-full bg-white shadow-xl z-1101
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          w-80 md:w-80 max-w-[90vw]
        `}
      >
        {/* Header section */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Sve zone ({zones.length})</h2>

            {/* Close button */}
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Zatvori"
            >
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search input with clear button */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pretraži zone..."
              className="w-full px-3 py-2 pl-9 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />

            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Sort toggle buttons */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setSortBy("date")}
              className={`
                flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors
                ${sortBy === "date" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Datum
            </button>
            <button
              onClick={() => setSortBy("name")}
              className={`
                flex-1 px-3 py-1.5 text-xs rounded-lg transition-colors
                ${sortBy === "name" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
            >
              Naziv
            </button>
          </div>
        </div>

        {/* Zone list - scrollable area */}
        <div className="overflow-y-auto h-[calc(100vh-180px)]">
          {filteredZones.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchQuery ? (
                <>
                  <p className="text-sm">Nema zona koje odgovaraju pretrazi</p>
                  <p className="text-xs mt-1">"{searchQuery}"</p>
                </>
              ) : (
                <p className="text-sm">Nema zona na mapi</p>
              )}
            </div>
          ) : (
            filteredZones.map((zone) => (
              <ZoneListItem key={zone.id} zone={zone} onClick={onZoneClick} />
            ))
          )}
        </div>

        {filteredZones.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 text-center">
            {searchQuery
              ? `Prikazano ${filteredZones.length} od ${zones.length} zona`
              : `Ukupno ${zones.length} zona`}
          </div>
        )}
      </div>

      {isOpen && (
        <div onClick={onToggle} className="fixed inset-0 bg-black/10 z-1002 transition-opacity" />
      )}
    </>
  );
}
