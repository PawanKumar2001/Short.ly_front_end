import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleDark } = useTheme();

  return (
    <button
      onClick={toggleDark}
      className="relative w-16 h-8 flex items-center
      bg-white dark:bg-neutral-800
      border-2 border-black dark:border-white
      rounded-full px-1 transition-all duration-500"
    >
      {/* Sun Icon */}
      <span className="absolute left-2 text-xs z-0">☀️</span>

      {/* Moon Icon */}
      <span className="absolute right-2 text-xs z-0">🌙</span>

      {/* Toggle Circle */}
      <div
        className={`relative z-10 w-6 h-6 rounded-full shadow-md
    transition-transform duration-500
    ${darkMode ? "translate-x-7 bg-white" : "translate-x-0 bg-red-400"}`}
      />
    </button>
  );
}
