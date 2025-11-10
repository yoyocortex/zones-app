import { Circle, Polygon, Rectangle, Popup } from "react-leaflet";
import { useMemo } from "react";

/**
 * Renders all zones on the map with their popups
 * Displays zone information (area, coordinates, creation date)
 * Provides Edit and Delete buttons in popup
 * Uses useMemo to optimize rendering performance
 */
export default function ZoneLayer({ zones, onZoneClick, onZoneDelete }) {
  const renderZone = useMemo(() => {
    return zones.map((zone) => {
      const popupContent = (
        <div className="min-w-60">
          {/* Header with color indicator and zone name */}
          <div className="w-full flex items-center gap-3 mb-3 pb-3 border-b border-gray-200">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: zone.colorHex + "20" }}
            >
              <div className="w-6 h-6 rounded-full" style={{ backgroundColor: zone.colorHex }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-base truncate">{zone.name}</h3>
              <p className="text-xs text-gray-500 capitalize m-0">
                {zone.type === "polygon" && "Poligon"}
                {zone.type === "rectangle" && "Pravokutnik"}
                {zone.type === "circle" && "Krug"}
              </p>
            </div>
          </div>

          {/* Zone information section */}
          <div className="space-y-2 mb-3 text-xs">
            {/* Area display (if calculated) */}
            {zone.area && zone.area > 0 && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-700 w-20">Površina</span>
                <span className="text-gray-900">
                  {zone.area >= 1000000
                    ? `${(zone.area / 1000000).toFixed(2)} km²`
                    : zone.area >= 1000
                      ? `${(zone.area / 1000).toFixed(2)} km²`
                      : `${Math.round(zone.area)} m²`}
                </span>
              </div>
            )}

            {/* Center coordinates (if calculated) */}
            {zone.center && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-700 w-20">Koordinate</span>
                <div className="flex-1">
                  <div className="text-gray-900">{zone.center.lat.toFixed(4)}°N</div>
                  <div className="text-gray-900">{zone.center.lng.toFixed(4)}°E</div>
                </div>
              </div>
            )}

            {/* Creation timestamp */}
            {zone.createdAt && (
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-medium text-gray-700 w-20">Kreirano</span>
                <div className="flex-1">
                  <div className="text-gray-900">
                    {new Date(zone.createdAt).toLocaleDateString("hr-HR")}
                  </div>
                  <div className="text-gray-900">
                    {new Date(zone.createdAt).toLocaleTimeString("hr-HR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-3 border-t border-gray-200">
            <button
              onClick={() => onZoneClick(zone)}
              className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Uredi
            </button>
            <button
              onClick={() => onZoneDelete(zone)}
              className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
            >
              Obriši
            </button>
          </div>
        </div>
      );

      // Common styling for all zone shapes
      const commonOptions = {
        color: zone.colorHex,
        fillColor: zone.colorHex,
        fillOpacity: 0.2,
        weight: 2,
      };

      // Render appropriate Leaflet component based on zone type
      if (zone.type === "circle" && zone.radius) {
        return (
          <Circle
            key={zone.id}
            center={zone.coordinates[0]}
            radius={zone.radius}
            pathOptions={commonOptions}
          >
            <Popup>{popupContent}</Popup>
          </Circle>
        );
      }

      if (zone.type === "rectangle") {
        return (
          <Rectangle key={zone.id} bounds={zone.coordinates} pathOptions={commonOptions}>
            <Popup>{popupContent}</Popup>
          </Rectangle>
        );
      }

      if (zone.type === "polygon") {
        return (
          <Polygon key={zone.id} positions={zone.coordinates} pathOptions={commonOptions}>
            <Popup>{popupContent}</Popup>
          </Polygon>
        );
      }

      return null;
    });
  }, [zones, onZoneClick, onZoneDelete]);

  return <>{renderZone}</>;
}
