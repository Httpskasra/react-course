import Navbar from "./components/Navbar";
import ThemeStatus from "./components/ThemeStatus";
import { useTheme } from "./context/ThemeContext";
import MainPage from "./pages/MainPage";

function App() {
  const { theme } = useTheme();

  return (
    <div className={`app ${theme}`}>
      <Navbar />
      <MainPage />
    </div>
  );
}

export default App;
