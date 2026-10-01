import { useTheme } from "../context/ThemeContext";

function ThemeStatus() {
  const { theme } = useTheme();

  return (
    <div className="status-card">
      <span className="status-label">Current Theme</span>
      <strong>{theme === "light" ? "Light ☀️" : "Dark 🌙"}</strong>
    </div>
  );
}

export default ThemeStatus;
