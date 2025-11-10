import { useState, useCallback, useMemo } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { toast } from "sonner";
import UserLocationMarker from "./UserLocationMarker";
import DrawingToolbar from "./DrawingToolbar";
import ZoneModal from "./ZoneModal";
import ZoneEditModal from "./ZoneEditModal";
import ZoneLayer from "./ZoneLayer";
import ZoneListSidebar from "./ZoneListSidebar";
import ColorFilter from "./ColorFilter";
import ConfirmDialog from "./ConfirmDialog";
import { useZones } from "../hooks/useZones";
import { getColorHex } from "../constants/zones";
import { checkZoneOverlap } from "../utils/zoneValidation";

/**
 * Helper component to control map view programmatically
 * Handles centering/fitting bounds when zone is clicked from sidebar
 */
function MapController({ centerTarget }) {
  const map = useMap();

  if (centerTarget) {
    const { coordinates, type } = centerTarget;

    if (type === "circle") {
      map.setView(coordinates[0], 15, { animate: true });
    } else if (type === "rectangle" || type === "polygon") {
      // Unwrap nested coordinate arrays
      let coords = coordinates;
      while (Array.isArray(coords[0]) && Array.isArray(coords[0][0]) && coords.length === 1) {
        coords = coords[0];
      }

      // Convert all coordinate formats to [lat, lng] arrays
      const points = coords
        .map((point) => {
          if (Array.isArray(point)) return point;
          if (point.lat !== undefined && point.lng !== undefined) {
            return [point.lat, point.lng];
          }
          return null;
        })
        .filter((p) => p !== null);

      // Fit map bounds to show entire zone
      if (points.length > 0) {
        const lats = points.map((p) => p[0]);
        const lngs = points.map((p) => p[1]);
        const bounds = [
          [Math.min(...lats), Math.min(...lngs)],
          [Math.max(...lats), Math.max(...lngs)],
        ];
        map.fitBounds(bounds, { padding: [50, 50], animate: true });
      }
    }
  }

  return null;
}

/**
 * Main Map component - orchestrates all map-related functionality
 * Handles zone creation, editing, deletion with overlap validation
 * Manages multiple modals (create, edit, confirm delete)
 * Integrates color filtering and zone list sidebar
 */
export default function Map() {
  const defaultPosition = [45.815, 15.9819]; // Zagreb, Croatia
  const { zones, addZone, updateZone, deleteZone } = useZones();

  // Zone creation modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingZone, setPendingZone] = useState(null);

  // Zone edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingZone, setEditingZone] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [centerTarget, setCenterTarget] = useState(null);

  // Confirmation dialog state (for delete actions)
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  // Color filter state (all colors selected by default)
  const [activeColorFilters, setActiveColorFilters] = useState([
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
  ]);

  // Filter zones based on selected colors
  const filteredZones = useMemo(() => {
    return zones.filter((zone) => activeColorFilters.includes(zone.color));
  }, [zones, activeColorFilters]);

  /**
   * Handle new zone drawn on map
   * Validates overlap with existing zones before opening modal
   */
  const handleZoneCreated = useCallback(
    (zoneData) => {
      const { hasOverlap, overlappingZones } = checkZoneOverlap(zoneData, zones);

      if (hasOverlap) {
        const zoneNames = overlappingZones.map((z) => z.name).join(", ");

        // Remove overlapping zone from map
        if (zoneData.removeLayer) {
          zoneData.removeLayer();
        }

        toast.error("Zona se preklapa", {
          description: `Zona se preklapa sa: ${zoneNames}. Nacrtajte zonu na drugom mjestu.`,
          duration: 4000,
        });

        return;
      }

      if (zoneData.keepLayer) {
        zoneData.keepLayer();
      }

      setPendingZone(zoneData);
      setIsModalOpen(true);
    },
    [zones]
  );

  const handleSaveZone = useCallback(
    ({ name, color }) => {
      if (!pendingZone) return;

      const newZone = {
        name,
        color,
        colorHex: getColorHex(color),
        type: pendingZone.type,
        coordinates: pendingZone.coordinates,
        radius: pendingZone.radius,
      };

      // Remove temporary drawing layer
      if (pendingZone.removeLayer) {
        pendingZone.removeLayer();
      }

      addZone(newZone);

      setIsModalOpen(false);
      setPendingZone(null);

      toast.success("Zona spremljena", {
        description: `"${name}" je uspješno dodana.`,
      });
    },
    [pendingZone, addZone]
  );

  const handleCancelZone = useCallback(() => {
    if (pendingZone?.removeLayer) {
      pendingZone.removeLayer();
    }

    setIsModalOpen(false);
    setPendingZone(null);
  }, [pendingZone]);

  const handleZoneClick = useCallback((zone) => {
    setEditingZone(zone);
    setIsEditModalOpen(true);
  }, []);

  const handleZoneDeleteFromPopup = useCallback(
    (zone) => {
      setConfirmDialog({
        isOpen: true,
        title: "Obriši zonu",
        message: `Sigurno želiš obrisati zonu "${zone.name}"? Ova akcija se ne može poništiti.`,
        onConfirm: () => {
          deleteZone(zone.id);
          setConfirmDialog({ isOpen: false });
          toast.success("Zona obrisana", {
            description: `"${zone.name}" je uspješno obrisana.`,
          });
        },
      });
    },
    [deleteZone]
  );

  const handleEditSave = useCallback(
    ({ name, color }) => {
      if (!editingZone) return;

      updateZone(editingZone.id, {
        name,
        color,
        colorHex: getColorHex(color),
      });

      setIsEditModalOpen(false);
      setEditingZone(null);

      toast.success("Zona ažurirana", {
        description: `"${name}" je uspješno ažurirana.`,
      });
    },
    [editingZone, updateZone]
  );

  const handleEditCancel = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingZone(null);
  }, []);

  const handleDeleteZone = useCallback(
    (zone) => {
      setConfirmDialog({
        isOpen: true,
        title: "Obriši zonu",
        message: `Sigurno želiš obrisati zonu "${zone.name}"? Ova akcija se ne može poništiti.`,
        onConfirm: () => {
          deleteZone(zone.id);
          setIsEditModalOpen(false);
          setEditingZone(null);
          setConfirmDialog({ isOpen: false });
          toast.success("Zona obrisana", {
            description: `"${zone.name}" je uspješno obrisana.`,
          });
        },
      });
    },
    [deleteZone]
  );

  const handleZoneClickFromSidebar = useCallback((zone) => {
    setCenterTarget({
      coordinates: zone.coordinates,
      type: zone.type,
    });

    setIsSidebarOpen(false);

    // Clear center target after animation completes
    setTimeout(() => setCenterTarget(null), 1000);
  }, []);

  const handleColorFilterChange = useCallback((selectedColors) => {
    setActiveColorFilters(selectedColors);
  }, []);

  return (
    <div className="relative">
      {/* Zone list sidebar */}
      <ZoneListSidebar
        zones={filteredZones}
        onZoneClick={handleZoneClickFromSidebar}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Leaflet map */}
      <MapContainer
        center={defaultPosition}
        zoom={13}
        style={{ height: "600px", width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <UserLocationMarker />
        <DrawingToolbar onZoneCreated={handleZoneCreated} />
        <ZoneLayer
          zones={filteredZones}
          onZoneClick={handleZoneClick}
          onZoneDelete={handleZoneDeleteFromPopup}
        />

        <MapController centerTarget={centerTarget} />
      </MapContainer>

      {/* Color filter */}
      <ColorFilter onFilterChange={handleColorFilterChange} />

      {/* Zone counter */}
      <div className="absolute bg-white px-3 py-2 rounded shadow text-sm z-1002 top-4 right-16 md:top-16 md:right-4">
        <span className="font-medium">{filteredZones.length}</span>
        <span className="text-gray-500"> / {zones.length} zona</span>
      </div>

      {/* Sidebar toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute bottom-4 right-4 z-1002 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-50 transition-colors cursor-pointer"
        title="Prikaži listu zona"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Modals */}
      <ZoneModal
        isOpen={isModalOpen}
        zoneType={pendingZone?.type}
        onSave={handleSaveZone}
        onCancel={handleCancelZone}
      />

      <ZoneEditModal
        isOpen={isEditModalOpen}
        zone={editingZone}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        onDelete={handleDeleteZone}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Obriši"
        cancelText="Odustani"
        variant="danger"
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false })}
      />
    </div>
  );
}
