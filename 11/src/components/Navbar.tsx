import { useTheme } from "../context/ThemeContext";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { clearDemoSession, logout } from "../feature/authSlice";
import ThemeButton from "./ThemeButton";

function Navbar() {
  const { theme } = useTheme();
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  function signOut() {
    clearDemoSession();
    dispatch(logout());
  }
  return (
    <nav className="navbar">
      <div>
        <div className="brand">Context Shop</div>
        <div className="subtitle">React + TypeScript · {theme} theme</div>
      </div>
      <div className="navbar-actions">
        {user && <><span className="nav-user">{user.name}</span><button className="secondary-button" onClick={signOut}>خروج</button></>}
        <ThemeButton />
      </div>
    </nav>
  );
}
export default Navbar;
