import { Routes, Route, Navigate, useLocation } from "react-router";
import { Toaster } from "sonner";
import { useState, useEffect } from "react";

import Nav from "./components/Nav";
import MapPage from "./pages/MapPage";
import ZonesPage from "./pages/ZonesPage";
import SettingsPage from "./pages/SettingsPage";

/**
 * Main application component
 * Sets up routing and global layout structure
 * Includes toast notification system (Sonner)
 */
function App() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500); // 500ms simulated loading

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" richColors closeButton duration={3000} />
      <Nav />

      <main className="relative min-h-[calc(100vh-64px)]">
        {isLoading ? (
          <div className="flex items-center justify-center h-[calc(100vh-64px)]">
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Loading...</p>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/zones" element={<ZonesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
