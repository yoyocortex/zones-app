/**
 * Custom animated SVG icon component for user location marker
 * Features a waving arm animation using CSS
 */
export default function WavingPersonIcon({ size = 32, color = "#3b82f6" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="waving-person-icon"
    >
      <circle cx="12" cy="6" r="3" fill={color} />

      <path d="M12 10 L12 16" stroke={color} strokeWidth="2" strokeLinecap="round" />

      <path d="M12 11 L9 14" stroke={color} strokeWidth="2" strokeLinecap="round" />

      <path
        d="M12 11 L15 8"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        className="waving-arm"
      />

      <path d="M12 16 L10 20 M12 16 L14 20" stroke={color} strokeWidth="2" strokeLinecap="round" />

      <circle cx="12" cy="6" r="3.5" fill="none" stroke="white" strokeWidth="1" />
    </svg>
  );
}
