import Map from "../components/Map";

/**
 * Map page component
 * Contains the full map interface with all zone management features
 */
export default function MapPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Map View</h1>
        </div>

        <Map />
      </div>
    </div>
  );
}
