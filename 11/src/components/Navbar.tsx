import { useTheme } from "../context/ThemeContext";
import ThemeButton from "./ThemeButton";

function Navbar() {
  const { theme } = useTheme();
  return (
    <nav className="navbar">
      <div>
        <div className="brand">Context Shop</div>
        <div className="subtitle">React + TypeScript</div>

        <h1>{theme}</h1>
      </div>

      <ThemeButton />
    </nav>
  );
}

export default Navbar;
