import { useEffect } from "react";
import { Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { renderToString } from "react-dom/server";
import WavingPersonIcon from "../assets/icons/WavingPerson";
import { useGeolocation } from "../hooks/useGeolocation";
import LocateMeButton from "./LocateMeButton";

/**
 * User location marker component with geolocation integration
 * Shows user's position on map with custom waving person icon
 * Displays accuracy circle and coordinates in popup
 * Auto-centers map when location is obtained
 */
export default function UserLocationMarker() {
  const { location, loading, error, permissionDenied, refetch } = useGeolocation({
    enableHighAccuracy: true,
    timeout: 10000,
  });

  const map = useMap();

  // Auto-center map on user location when obtained
  useEffect(() => {
    if (location) map.setView(location.position, map.getZoom(), { animate: true });
  }, [location, map]);

  // Create custom user location icon using WavingPerson SVG
  const userIcon = L.divIcon({
    className: "custom-user-location-marker",
    html: renderToString(<WavingPersonIcon size={32} color="#3b82f6" />),
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

  return (
    <>
      {/* Button to trigger location request */}
      <LocateMeButton
        onLocate={refetch}
        loading={loading}
        success={!!location && !loading && !error}
        error={!!error && !permissionDenied}
        permissionDenied={permissionDenied}
      />

      {location && (
        <>
          {/* Accuracy circle showing GPS precision */}
          {location.accuracy && (
            <Circle
              center={location.position}
              radius={location.accuracy * 0.5}
              pathOptions={{
                color: "#3b82f6",
                fillColor: "#3b82f6",
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          )}

          {/* User location marker */}
          <Marker position={location.position} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold mb-1">Tvoja lokacija</p>
                <p className="text-xs text-gray-600">
                  {location.position[0].toFixed(5)}°N, {location.position[1].toFixed(5)}°E
                </p>
                {location.accuracy && (
                  <p className="text-xs text-gray-500 mt-1">
                    Točnost: ±{Math.round(location.accuracy)}m
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        </>
      )}
    </>
  );
}
