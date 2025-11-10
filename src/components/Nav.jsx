import { useState } from "react";
import { NavLink } from "react-router";

/**
 * Navigation bar component with responsive mobile menu
 * Desktop: horizontal navigation links
 * Mobile: hamburger menu with dropdown
 * Sticky positioning to stay at top during scroll
 */
export default function Nav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dynamic link styling based on active route (desktop)
  const linkClass = ({ isActive }) =>
    "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
    (isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100");

  // Dynamic link styling for mobile dropdown
  const mobileLinkClass = ({ isActive }) =>
    "block px-4 py-2 text-sm font-medium transition-colors " +
    (isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100");

  return (
    <header className="bg-white shadow sticky top-0 z-1100">
      <div className="max-w-full mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-gray-800">Zones App</div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-2">
            <NavLink to="/" className={linkClass} end>
              Map
            </NavLink>
            <NavLink to="/zones" className={linkClass}>
              Zones
            </NavLink>
            <NavLink to="/settings" className={linkClass}>
              Settings
            </NavLink>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
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
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-1 pb-2 border-t border-gray-200 pt-2">
            <NavLink
              to="/"
              className={mobileLinkClass}
              end
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Map
            </NavLink>
            <NavLink
              to="/zones"
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Zones
            </NavLink>
            <NavLink
              to="/settings"
              className={mobileLinkClass}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Settings
            </NavLink>
          </nav>
        )}
      </div>
    </header>
  );
}
