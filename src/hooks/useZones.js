import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { calculateZoneArea, calculateZoneCenter } from "../utils/zoneCalculations";

const STORAGE_KEY = "parking-zones";

/**
 * Custom hook for managing zones state
 * - localStorage persistence
 * - Automatic area and center calculation
 * - CRUD operations (Create, Read, Update, Delete)
 * - Prevents unnecessary saves with ref comparison
 */
export function useZones() {
  /**
   * Initialize state from localStorage on mount
   */
  const [zones, setZones] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed;
      }
    } catch (error) {
      console.error("[useZones] Error loading zones:", error);
    }
    return [];
  });

  const [loading] = useState(false);
  const previousZonesRef = useRef(zones);

  /**
   * Save zones to localStorage whenever they change
   * Uses ref to prevent saving when zones haven't actually changed
   */
  useEffect(() => {
    // Skip if zones haven't changed (prevents infinite loops)
    if (JSON.stringify(previousZonesRef.current) === JSON.stringify(zones)) {
      return;
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
      previousZonesRef.current = zones;
    } catch (error) {
      console.error("[useZones] Error saving zones:", error);
    }
  }, [zones]);

  /**
   * Add new zone with calculated area and center
   */
  const addZone = (zoneData) => {
    const area = calculateZoneArea(zoneData);
    const center = calculateZoneCenter(zoneData);

    const newZone = {
      id: uuidv4(),
      ...zoneData,
      area, // Calculated area in m²
      center, // Calculated center point { lat, lng }
      createdAt: new Date().toISOString(),
    };

    setZones((prev) => [...prev, newZone]);
    return newZone;
  };

  /**
   * Update existing zone properties
   */
  const updateZone = (id, updates) => {
    setZones((prev) => prev.map((zone) => (zone.id === id ? { ...zone, ...updates } : zone)));
  };

  /**
   * Delete zone by ID
   */
  const deleteZone = (id) => {
    setZones((prev) => prev.filter((zone) => zone.id !== id));
  };

  /**
   * Clear all zones
   */
  const clearZones = () => {
    setZones([]);
  };

  return {
    zones,
    loading,
    addZone,
    updateZone,
    deleteZone,
    clearZones,
  };
}
