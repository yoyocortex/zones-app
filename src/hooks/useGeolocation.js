import { useState, useCallback, useEffect } from "react";

/**
 * Custom hook for accessing user's geolocation
 * - Automatic permission checking
 * - Permission state monitoring
 * - Manual refetch capability
 * - Configurable accuracy and timeout
 * - Error handling for all geolocation failure modes
 */
export function useGeolocation(options = {}) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [permissionDenied, setPermissionDenied] = useState(false);

  /**
   * Check geolocation permission status on mount
   * Monitors permission changes in real-time
   */
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    if (!navigator.permissions) {
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionDenied(result.state === "denied");

      // Listen for permission changes
      result.addEventListener("change", () => {
        setPermissionDenied(result.state === "denied");
      });
    } catch (err) {
      console.error("[useGeolocation] Permissions API error:", err);
    }
  };

  /**
   * Fetch user's current location
   */
  const fetchLocation = useCallback(() => {
    setLoading(true);
    setError(null);

    const simulateDelay = options.simulateDelay ?? 0;

    if (!navigator.geolocation) {
      setTimeout(() => {
        setError("Geolocation nije podržan u tvom browseru");
        setLoading(false);
      }, simulateDelay);
      return;
    }

    const timeoutDuration = options.timeout ?? 10000;

    // Timeout fallback if geolocation takes too long
    const timeoutId = setTimeout(() => {
      setError("Timeout - ne mogu dohvatiti lokaciju");
      setLoading(false);
    }, timeoutDuration);

    // Request user location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);

        const { latitude, longitude, accuracy } = position.coords;

        const newLocation = {
          position: [latitude, longitude],
          accuracy,
          timestamp: position.timestamp,
        };

        setTimeout(() => {
          setLocation(newLocation);
          setLoading(false);
          setError(null);
          setPermissionDenied(false);
        }, simulateDelay);
      },
      (err) => {
        clearTimeout(timeoutId);

        // Handle different error types
        let errorMessage;
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Dozvola za lokaciju odbijena";
            setPermissionDenied(true);
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "Lokacija trenutno nedostupna";
            break;
          case err.TIMEOUT:
            errorMessage = "Timeout pri dohvaćanju lokacije";
            break;
          default:
            errorMessage = "Ne mogu dohvatiti lokaciju";
        }

        setTimeout(() => {
          setError(errorMessage);
          setLoading(false);
        }, simulateDelay);
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: timeoutDuration,
        maximumAge: options.maximumAge ?? 0, // Don't use cached position
      }
    );
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge, options.simulateDelay]);

  return {
    location, // { position: [lat, lng], accuracy, timestamp }
    loading,
    error,
    permissionDenied,
    refetch: fetchLocation,
  };
}
