import Navbar from "./components/Navbar";
import { useTheme } from "./context/ThemeContext";
import { useAppSelector } from "./app/hooks";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";

function App() {
  const { theme } = useTheme();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  return (
    <div className={`app ${theme}`}>
      <Navbar />
      {isAuth ? <MainPage /> : <LoginPage />}
    </div>
  );
}
export default App;
