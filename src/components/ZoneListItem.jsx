/**
 * Individual zone list item component
 * Shows zone color, name, type, and creation date
 * Displays hover arrow indicator
 * Used in ZoneListSidebar
 */
export default function ZoneListItem({ zone, onClick }) {
  // Format ISO date string to Croatian locale format (DD.MM. HH:MM)
  const formatDate = (isoDate) => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}.${month}. ${hours}:${minutes}`;
  };

  // Convert zone type to Croatian label
  const getTypeLabel = (type) => {
    if (type === "polygon") return "Poligon";
    if (type === "rectangle") return "Pravokutnik";
    if (type === "circle") return "Krug";
    return type;
  };

  return (
    <button
      onClick={() => onClick(zone)}
      className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors group"
    >
      <div className="flex items-start gap-3">
        {/* Color indicator circle */}
        <div
          className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0 mt-0.5"
          style={{ backgroundColor: zone.colorHex }}
        />

        {/* Zone information */}
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate group-hover:text-blue-600">
            {zone.name}
          </p>
          {/* Zone type and creation date */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <span>{getTypeLabel(zone.type)}</span>
            <span>•</span>
            <span>{formatDate(zone.createdAt)}</span>
          </div>
        </div>

        {/* Hover arrow indicator */}
        <svg
          className="w-4 h-4 text-gray-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </button>
  );
}
