import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-draw";
import { getColorHex } from "../constants/zones";

/**
 * Leaflet Draw toolbar integration component
 * Provides polygon, rectangle, and circle drawing tools
 * Handles draw events and passes zone data to parent
 * Manages temporary layer cleanup
 */
export default function DrawingToolbar({ onZoneCreated }) {
  const map = useMap();
  const drawnItemsRef = useRef(null);

  useEffect(() => {
    // Initialize Leaflet FeatureGroup to hold drawn items
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    // Configure drawing controls
    const drawControl = new L.Control.Draw({
      position: "topleft",
      draw: {
        polygon: {
          allowIntersection: false,
          showArea: false,
          drawError: {
            color: "#e74c3c",
            message: "Poligon se ne može preklapati!",
          },
          shapeOptions: {
            color: getColorHex("blue"),
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3,
          },
        },
        rectangle: {
          showArea: false,
          shapeOptions: {
            color: getColorHex("blue"),
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3,
          },
        },
        circle: {
          shapeOptions: {
            color: getColorHex("blue"),
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.3,
          },
        },
        // Disable unused drawing tools
        circlemarker: false,
        marker: false,
        polyline: false,
      },
      edit: {
        featureGroup: drawnItems,
        remove: false, // Disable edit/remove toolbar
      },
    });

    map.addControl(drawControl);

    // Handle new zone drawn event
    const handleDrawCreated = (event) => {
      const layer = event.layer;
      const type = event.layerType;

      let coordinates;
      let radius;

      // Extract coordinates based on shape type
      if (type === "polygon" || type === "rectangle") {
        const rawCoords = layer.getLatLngs();
        coordinates = convertLatLngsToArrays(rawCoords);
      } else if (type === "circle") {
        const center = layer.getLatLng();
        radius = layer.getRadius();
        coordinates = [[center.lat, center.lng]];
      }

      // Pass zone data to parent with layer control methods
      onZoneCreated?.({
        type,
        coordinates,
        radius,
        layer,
        // Helper methods for parent to manage layer visibility
        keepLayer: () => {
          drawnItems.addLayer(layer);
        },
        removeLayer: () => {
          map.removeLayer(layer);
        },
      });
    };

    map.on(L.Draw.Event.CREATED, handleDrawCreated);

    // Cleanup on unmount
    return () => {
      map.off(L.Draw.Event.CREATED, handleDrawCreated);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [map, onZoneCreated]);

  return null; // No visual component, only map integration
}

/**
 * Recursively convert Leaflet LatLng objects to plain [lat, lng] arrays
 * Handles nested arrays from polygons and rectangles
 */
function convertLatLngsToArrays(latlngs) {
  if (!Array.isArray(latlngs)) {
    return [[latlngs.lat, latlngs.lng]];
  }

  return latlngs.map((item) => {
    if (Array.isArray(item)) {
      return convertLatLngsToArrays(item);
    }
    if (item.lat !== undefined && item.lng !== undefined) {
      return [item.lat, item.lng];
    }
    return item;
  });
}
